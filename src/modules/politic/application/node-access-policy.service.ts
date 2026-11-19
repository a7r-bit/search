import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { isUUID } from 'class-validator';
import { NodeRepository } from '../../node/domain/node.repository';
import { NodeTreeRepository } from '../../node/domain/node-tree.repository';
import { GroupRepository } from '../domain/group.repository';
import { GroupWithAccessesDTO } from '../presentation/dto/group-with-accesses.dto';
import { UpdateGroupsAccessesDTO } from '../presentation/dto/update-group-access.dto';

@Injectable()
export class NodeAccessPolicyService {
    constructor(
        private readonly nodeRepository: NodeRepository,
        private readonly nodeTreeRepository: NodeTreeRepository,
        private readonly groupRepository: GroupRepository,
    ) {}

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

    async checkUserToNodeAccess(userPolicies: string[], nodeId: string): Promise<boolean> {
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
}
