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
import { ApiPaginatedResponse } from '../../common/paginator/pagination.decorator';
import { PaginateResult } from '../../common/paginator/paginator';

@Controller('node')
@ApiBearerAuth('access-token')
export class NodeController {
    constructor(private readonly nodeService: NodeService) {}

    @Post()
    @ApiOperation({
        summary: 'Создание Node (type: Directory)',
        description: 'Создание новой директории.',
    })
    @ApiBody({
        type: CreateNodeDto,
        required: true,
        description: 'Данные для создания директории',
    })
    @ApiCreatedResponse({ type: NodeDto })
    async create(@Body() dto: CreateNodeDto): Promise<NodeDto> {
        return await this.nodeService.create(dto);
    }

    @Get('children')
    @ApiOperation({
        summary: 'Получение дочерних элементов c правами доступа с ним',
        description: `Получение дочерних элементов директори с permissions для текущего пользователя.
      Если пользователь является Owner-ом, то он получает все дочерние элементы с правами доступа. 
      Если пользователь не является Owner-ом, то он получает только те дочерние элементы, к которым имеет доступ, с их правами доступа.`,
    })
    @ApiPaginatedResponse(NodeWithPermissionsDto)
    @ApiSortingQuery([...Object.values(NodeSortParamsEnum)])
    @UseGuards(CheckGroupPolitic)
    async findChildren(
        @Query() query: ListNodesQueryDto,
        @Req() req,
        @SortingParams([...Object.values(NodeSortParamsEnum)]) sort?: SortingParam,
    ): Promise<PaginateResult<NodeWithPermissionsDto>> {
        return await this.nodeService.listChildren(query, req.user as RequestUser, sort);
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Поиск Node по id',
        description: 'Поиск Node по id.',
    })
    @ApiParam({ name: 'id' })
    @ApiOkResponse({ type: NodeDto })
    async findById(@Param('id', new CustomParseUUIDPipe()) id: string): Promise<NodeDto> {
        return await this.nodeService.findById(id);
    }

    @Patch(':id')
    @ApiOperation({
        summary: 'Обновление Node',
    })
    @ApiBody({
        type: UpdateNodeDto,
    })
    @ApiOkResponse({ type: NodeDto })
    async update(@Param('id') id: string, @Body() dto: UpdateNodeDto): Promise<NodeDto> {
        return await this.nodeService.update(id, dto);
    }

    @Put(':id/move')
    @ApiOperation({
        summary: 'Поремещение Node',
        description: 'Установление parentId по переданному id',
    })
    @ApiOkResponse({ type: NodeDto })
    async move(@Param('id') id: string, @Body() dto: MoveNodeDto): Promise<NodeDto> {
        return await this.nodeService.move(id, dto.newParentId ?? null);
    }

    @Get(':id/path')
    @ApiOperation({
        summary: 'Получение пути к текущей директории',
        description: 'Получение пути к текущей директории по переданному id.',
    })
    @ApiOkResponse({ type: PathPart, isArray: true })
    async getPath(@Param('id') id: string): Promise<PathPart[]> {
        return await this.nodeService.getPath(id);
    }

    @Get('path/root')
    @ApiOperation({
        summary: 'Получение пути к ролительским директориям',
    })
    @ApiOkResponse({ type: PathPart, isArray: true })
    async getRootPath(): Promise<PathPart[]> {
        return await this.nodeService.getRootPath();
    }

    @Delete(':id')
    @ApiOperation({
        summary: 'Удаление node',
        description: 'Удаляет node по id вместе со всеми дочерними node-ами и связанными сущностями.',
    })
    @ApiOkResponse({ type: NodeDto })
    async remove(@Param('id', new CustomParseUUIDPipe()) id: string): Promise<NodeDto> {
        return await this.nodeService.delete(id);
    }
}
