import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { NodeService } from './node.service';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam } from '@nestjs/swagger';
import { CreateNodeDto } from './dto/create-node.dto';
import { ListNodesQueryDto } from './dto/list-nodes.query';
import { MoveNodeDto, UpdateNodeDto } from './dto';
import { NodeDto } from './dto/node.dto';
import { NodeSortParamsEnum } from './dto/node_sort_params_enum.dto';
import { ApiSortingQuery } from '../../common/decorators/sorting-params-swagger.decorator';
import { SortingParams, SortingParam } from '../../common/decorators/sorting-params.decorator';
import { PathPart } from '../../common/types/path-part.dto';
import { CustomParseUUIDPipe } from '../../common/pipes';
import { CheckGroupPolitic } from '../../common/guards/group-politic.guard';
import { NodeWithPermissionsDto } from './dto/node-with-permissions.dto';
import { RequestUser } from '../../common/types/request-user';
import { TreeItemDto } from './dto/tree-item.dto';

@Controller('node')
@ApiBearerAuth('access-token')
export class NodeController {
    constructor(private readonly nodeService: NodeService) {}

    @Post()
    @ApiOperation({
        summary: 'Создать узел',
        description: 'Создает новый узел (директорию или файл) с указанными параметрами.',
    })
    @ApiBody({
        type: CreateNodeDto,
        required: true,
        description: 'Данные для создания узла',
    })
    @ApiCreatedResponse({ type: NodeDto })
    async create(@Body() dto: CreateNodeDto): Promise<NodeDto> {
        return await this.nodeService.create(dto);
    }

    @Get('children')
    @ApiOperation({
        summary: 'Получить дочерние элементы',
        description: `Возвращает дочерние элементы директории с правами доступа для текущего пользователя.
Если пользователь является owner, возвращаются все дочерние элементы.
Если пользователь не является owner, возвращаются только доступные ему элементы.`,
    })
    @ApiOkResponse({ description: 'Список дочерних элементов дерева', type: TreeItemDto, isArray: true })
    @ApiSortingQuery([...Object.values(NodeSortParamsEnum)])
    @UseGuards(CheckGroupPolitic)
    async findChildren(
        @Query() query: ListNodesQueryDto,
        @Req() req,
        @SortingParams([...Object.values(NodeSortParamsEnum)]) sort?: SortingParam,
    ): Promise<TreeItemDto[]> {
        return await this.nodeService.listChildren(query, req.user as RequestUser, sort);
    }


    @Get(':id')
    @ApiOperation({
        summary: 'Получить узел по ID',
        description: 'Возвращает узел по идентификатору.',
    })
    @ApiParam({ name: 'id', description: 'ID узла', format: 'uuid' })
    @ApiOkResponse({ type: NodeDto })
    async findById(@Param('id', new CustomParseUUIDPipe()) id: string): Promise<NodeDto> {
        return await this.nodeService.findById(id);
    }

    @Patch(':id')
    @ApiOperation({
        summary: 'Обновить узел',
        description: 'Обновляет поля узла по идентификатору.',
    })
    @ApiParam({ name: 'id', description: 'ID узла', format: 'uuid' })
    @ApiBody({
        type: UpdateNodeDto,
        description: 'Поля для обновления узла',
    })
    @ApiOkResponse({ type: NodeDto })
    async update(@Param('id') id: string, @Body() dto: UpdateNodeDto): Promise<NodeDto> {
        return await this.nodeService.update(id, dto);
    }

    @Put(':id/move')
    @ApiOperation({
        summary: 'Переместить узел',
        description: 'Перемещает узел в другую директорию, задавая новый parentId.',
    })
    @ApiParam({ name: 'id', description: 'ID перемещаемого узла', format: 'uuid' })
    @ApiBody({
        type: MoveNodeDto,
        description: 'Новый родительский узел',
    })
    @ApiOkResponse({ type: NodeDto })
    async move(@Param('id') id: string, @Body() dto: MoveNodeDto): Promise<NodeDto> {
        return await this.nodeService.move(id, dto.newParentId ?? null);
    }

    @Get(':id/path')
    @ApiOperation({
        summary: 'Получить путь к узлу',
        description: 'Возвращает путь от корня до указанного узла.',
    })
    @ApiParam({ name: 'id', description: 'ID узла', format: 'uuid' })
    @ApiOkResponse({ type: PathPart, isArray: true })
    async getPath(@Param('id') id: string): Promise<PathPart[]> {
        return await this.nodeService.getPath(id);
    }


    @Delete(':id')
    @ApiOperation({
        summary: 'Удалить узел',
        description: 'Удаляет узел вместе со всеми дочерними узлами и связанными сущностями.',
    })
    @ApiParam({ name: 'id', description: 'ID удаляемого узла', format: 'uuid' })
    @ApiOkResponse({ type: NodeDto })
    async remove(@Param('id', new CustomParseUUIDPipe()) id: string): Promise<NodeDto> {
        return await this.nodeService.delete(id);
    }

}
