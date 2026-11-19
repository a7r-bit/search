import { GroupRepository } from '../domain/group.repository';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { toGroupDTO } from '../presentation/dto/group-mapper';
import { ListGroupQueryDto } from '../presentation/dto/list-group-query.dto';
import { PaginatedGroupResponseDto } from '../presentation/dto/paginated-group-response.dto';
import { CreateGroupDTO } from '../presentation/dto/create-group.dto';
import { isUUID } from 'class-validator';

@Injectable()
export class GroupService {
    constructor(private readonly groupRepository: GroupRepository) {}

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

    async addUsersToGroup(usersIds: string[], groupId: string) {
        await this.getGroupById(groupId);
        return await this.groupRepository.addUsers(groupId, usersIds);
    }

    async deleteUsersFromGroup(usersIds: string[], groupId: string) {
        await this.getGroupById(groupId);
        return await this.groupRepository.removeUsers(groupId, usersIds);
    }

    async getPoliticsByTabNumber(tabNumber: string) {
        const groups = await this.groupRepository.findByTabNumber(tabNumber);
        return groups.map((group) => toGroupDTO(group));
    }
}
