import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateGroupDTO } from '../presentation/dto/create-group.dto';
import { isUUID } from 'class-validator';
import { toGroupDTO } from '../presentation/dto/group-mapper';
import { ListGroupQueryDto } from '../presentation/dto/list-group-query.dto';
import { PaginatedGroupResponseDto } from '../presentation/dto/paginated-group-response.dto';
import { GroupWithAccessesDTO } from '../presentation/dto/group-with-accesses.dto';
import { UpdateGroupsAccessesDTO } from '../presentation/dto/update-group-access.dto';
import { NodeTreeRepository } from '../../node/domain/node-tree.repository';
import { NodeRepository } from '../../node/domain/node.repository';
import { GroupRepository } from '../domain/group.repository';

@Injectable()
export class PoliticService {
    constructor(
        private readonly nodeTreeRepository: NodeTreeRepository,
        private readonly nodeRepository: NodeRepository,
        private readonly groupRepository: GroupRepository,
    ) {}

    async updateGroupsAccesses(nodeId: string, body: UpdateGroupsAccessesDTO): Promise<GroupWithAccessesDTO[]> {
        await this.nodeRepository.findByIdOrThrow(nodeId);

        const groupIds = body.groups.map((group) => group.groupId);
        const uniqueGroupIds = new Set(groupIds);
        if (uniqueGroupIds.size !== groupIds.length) {
            throw new BadRequestException('Список групп содержит дубликаты.');
        }

        const existingGroups = await this.groupRepository.findIdsByIds(groupIds);
        if (existingGroups.length !== groupIds.length) {
            throw new NotFoundException('Групповая политика не найдена');
        }

        await this.groupRepository.setNodeAccesses(
            nodeId,
            body.groups.map((group) => ({ groupId: group.groupId, permissions: group.accesses })),
        );

        return this.getGroupsForNode(nodeId);
    }

    //    Get list of group
    async listGroups(query: ListGroupQueryDto): Promise<PaginatedGroupResponseDto> {
        const page = Number(query.page) ?? 1;
        const limit = Number(query.limit) ?? 20;
        const skip = (page - 1) * limit;

        const [groups, total] = await Promise.all([
            this.groupRepository.searchByName(query.search, skip, limit),
            this.groupRepository.countByName(query.search),
        ]);
        return {
            items: groups.map(toGroupDTO),
            total,
            page,
            limit,
        };
    }

    async getGroupsForNode(nodeId: string): Promise<GroupWithAccessesDTO[]> {
        if (!isUUID(nodeId)) {
            throw new BadRequestException('ID не валиден.');
        }

        await this.nodeRepository.findByIdOrThrow(nodeId);

        const groups = await this.groupRepository.findWithAccessForNode(nodeId);

        return groups.map((group) => ({
            id: group.id,
            name: group.name,
            accesses: group.access.flatMap((access) => access.permissions),
        }));
    }

    async getPoliticsByTabNumber(tabNumber: string) {
        const groups = await this.groupRepository.findByTabNumber(tabNumber);
        return groups.map((group) => toGroupDTO(group));
    }

    async getPolicesByNodeId(nodeId: string) {
        if (!isUUID(nodeId)) {
            throw new BadRequestException('ID не валиден.');
        }

        await this.nodeRepository.findByIdOrThrow(nodeId);

        const groups = await this.groupRepository.findForNode(nodeId);

        return groups.map((group) => toGroupDTO(group));
    }

    async addUsersToGroup(usersIds: string[], groupId: string) {
        await this.getGroupById(groupId);
        return await this.groupRepository.addUsers(groupId, usersIds);
    }

    async deleteUsersFromGroup(usersIds: string[], groupId: string) {
        await this.getGroupById(groupId);
        return await this.groupRepository.removeUsers(groupId, usersIds);
    }

    async checkUserToNodeAccess(userPolicies: string[], nodeId: string | null): Promise<boolean> {
        if (!nodeId) return true;

        const chain = await this.nodeTreeRepository.getAncestorChain(nodeId);

        if (chain.length === 0) return false;

        const accesses = await this.groupRepository.findAccessesForNodes(chain);

        const groupsByNode = new Map<string, Set<string>>();
        for (const a of accesses) {
            if (!groupsByNode.has(a.nodeId)) groupsByNode.set(a.nodeId, new Set());
            groupsByNode.get(a.nodeId).add(a.groupId);
        }

        const userPolicySet = new Set(userPolicies);
        for (const id of chain) {
            const groupIds = groupsByNode.get(id);
            if (groupIds && groupIds.size > 0) {
                return [...groupIds].some((gid) => userPolicySet.has(gid));
            }
        }
        return true;
    }

    async createGroup(createDTO: CreateGroupDTO) {
        const isUnique = await this.isUnique(createDTO.name);
        if (!isUnique) {
            throw new BadRequestException(`Групповая политика с названием ${createDTO.name} уже существует`);
        }
        return await this.groupRepository.create({ name: createDTO.name });
    }

    async deleteGroup(groupId: string) {
        return await this.groupRepository.delete(groupId);
    }

    private async isUnique(name: string) {
        const group = await this.groupRepository.findByName(name);
        return group ? false : true;
    }

    private async getGroupById(groupId: string) {
        if (!isUUID(groupId)) {
            throw new BadRequestException('ID не валиден.');
        }

        const group = await this.groupRepository.findById(groupId);
        if (!group) {
            throw new NotFoundException(`Групповая политика не найдена`);
        }
        return group;
    }
}
