import { Body, Controller, Get, Put, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { GroupService } from '../application/group.service';
import { NodeAccessPolicyService } from '../application/node-access-policy.service';
import { ListGroupQueryDto } from './dto/list-group-query.dto';
import { PaginatedGroupResponseDto } from './dto/paginated-group-response.dto';
import { GroupWithAccessesDTO } from './dto/group-with-accesses.dto';
import { GroupsForNodeQueryDto } from './dto/groups-for-node-query.dto';
import { NodeAdminGuard } from '../../../shared/presentation/guards/node-admin.guard';
import { UpdateGroupsAccessesDTO } from './dto/update-group-access.dto';

@Controller('politic')
@ApiBearerAuth('access-token')
export class PoliticController {
    constructor(
        private readonly groupService: GroupService,
        private readonly nodeAccessPolicyService: NodeAccessPolicyService,
    ) {}

    @Get('groups')
    @ApiOperation({
        summary: 'Получить список групп',
        description: 'Получает список групп с пагинацией и поиском',
    })
    @ApiOkResponse({ type: PaginatedGroupResponseDto })
    async listGroups(@Query() query: ListGroupQueryDto): Promise<PaginatedGroupResponseDto> {
        return await this.groupService.listGroups(query);
    }

    @Get('groups/accesses')
    @UseGuards(NodeAdminGuard)
    @ApiOperation({
        summary: 'Получить группы с правами доступа к узлу',
        description: 'Возвращает группы, у которых есть доступ к указанному узлу, с перечнем прав. Требуется право ADMIN на узел.',
    })
    @ApiOkResponse({ type: GroupWithAccessesDTO, isArray: true })
    async groupsWithAccesses(@Query() query: GroupsForNodeQueryDto): Promise<GroupWithAccessesDTO[]> {
        return await this.nodeAccessPolicyService.getGroupsForNode(query.nodeId);
    }

    @Put('groups/accesses')
    @UseGuards(NodeAdminGuard)
    @UsePipes(new ValidationPipe({ transform: true }))
    @ApiOperation({
        summary: 'Обновить права доступа групп к узлу',
        description: 'Обновляет права доступа групп к узлу, требуется право ADMIN на узел.',
    })
    @ApiBody({ type: UpdateGroupsAccessesDTO })
    @ApiOkResponse({ type: GroupWithAccessesDTO, isArray: true })
    async updateGroupsAccesses(
        @Query() query: GroupsForNodeQueryDto,
        @Body() body: UpdateGroupsAccessesDTO,
    ): Promise<GroupWithAccessesDTO[]> {
        return await this.nodeAccessPolicyService.updateGroupsAccesses(query.nodeId, body);
    }
}
