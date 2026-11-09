import { Injectable, Logger } from '@nestjs/common';
import { EmployeesParserService } from '../../infrastructure/employees-parser/employees-parser.service';
import { PoliticService } from '../politic/politic.service';
import { PrismaService } from '../prisma/prisma.service';
import { UserProvisioningService } from '../../user-provisioning/user-provisioning.service';

@Injectable()
export class SyncService {
    private readonly logger = new Logger(SyncService.name);
    constructor(
        private readonly employeesParserService: EmployeesParserService,
        private readonly politicService: PoliticService,
        private readonly prisma: PrismaService,
        private readonly userProvisioningService: UserProvisioningService,
    ) {}

    async syncGroups() {
        const extenalGroups = await this.employeesParserService.getDepartmentsList(1, 5000);
        await this.prisma.$transaction(async (tx) => {
            for (const group of extenalGroups) {
                await tx.group.upsert({
                    where: { externalId: group.id },
                    create: {
                        externalId: group.id,
                        name: group.name,
                    },
                    update: {
                        name: group.name,
                    },
                });
            }
        });
        return {
            syncedGroupsCount: extenalGroups.length,
            message: 'Groups synced successfully',
        };
    }

    async syncUsers() {
        const externalUsers = (await this.employeesParserService.getUsersList(1, 5000)).filter((user) => user.ldap_tab_num !== null);

        for (const user of externalUsers) {
            await this.userProvisioningService.provisionFromExternal({
                uidNumber: user.ldap_tab_num,
                firstName: user.fname,
                middleName: user.surname,
                departments: (user.departments ?? []).map((group) => ({ externalId: group.id, name: group.name })),
            });
        }
    }

    async findSyncUsersErrorReason() {
        const externalUsers = (await this.employeesParserService.getUsersList(1, 5000)).filter((user) => user.ldap_tab_num !== null);
        const conflicts: Array<{
            uidNumber: string;
            firstName: string;
            middleName: string;
            departmentExternalId: string;
            departmentName: string;
            existingGroupId: string;
            existingGroupExternalId: string | null;
        }> = [];

        for (const user of externalUsers) {
            for (const department of user.departments ?? []) {
                const existing = await this.prisma.group.findFirst({
                    where: {
                        name: department.name,
                        OR: [{ externalId: null }, { externalId: { not: department.id } }],
                    },
                    select: { id: true, externalId: true },
                });

                if (existing) {
                    conflicts.push({
                        uidNumber: user.ldap_tab_num,
                        firstName: user.fname,
                        middleName: user.surname,
                        departmentExternalId: department.id,
                        departmentName: department.name,
                        existingGroupId: existing.id,
                        existingGroupExternalId: existing.externalId,
                    });
                }
            }
        }

        this.logger.warn(`findSyncUsersErrorReason found ${conflicts.length} conflicts.`);

        return {
            totalExternalUsers: externalUsers.length,
            conflictsCount: conflicts.length,
            conflicts,
        };
    }
}
