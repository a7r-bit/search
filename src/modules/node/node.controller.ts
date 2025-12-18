import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { NodeService } from './node.service';
import { ApiBody, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CreateNodeDto } from './dto/create-node.dto';
import { ListNodesQueryDto } from './dto/list-nodes.query';
import { CustomParseUUIDPipe } from 'src/common/pipes';
import { MoveNodeDto, UpdateNodeDto } from './dto';
import { NodeDto } from './dto/node.dto';
import { PathPart } from 'src/common/path-part.dto';

@Controller('node')
export class NodeController {
  constructor(private readonly nodeService: NodeService) { }

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
  async create(@Body() dto: CreateNodeDto): Promise<NodeDto> {
    return await this.nodeService.create(dto);
  }

  @Get('children')
  @ApiOperation({
    summary: "Получение дочерних элементов",
    description: `
      Получение дочерних элементов директори`
  })
  // @ApiQuery({ type: ListNodesQueryDto })
  async findChildren(@Query() query: ListNodesQueryDto): Promise<NodeDto[]> {
    return await this.nodeService.listChildren(query.parentId ?? null);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Поиск Node по id',
    description: 'Поиск Node по id.',
  })
  @ApiParam({ name: "id" })
  async findById(@Param('id', new CustomParseUUIDPipe()) id: string): Promise<NodeDto> {
    return await this.nodeService.findById(id);
  }


  @Patch(':id')
  @ApiOperation({
    summary: "Обновление Node",
  })
  @ApiBody({
    type: UpdateNodeDto
  })
  async update(@Param('id') id: string, @Body() dto: UpdateNodeDto): Promise<NodeDto> {
    return await this.nodeService.update(id, dto);
  }

  @Post(':id/move')
  @ApiOperation({
    summary: "Поремещение Node",
    description: "Установление parentId по переданному id"
  })

  async move(@Param('id') id: string, @Body() dto: MoveNodeDto): Promise<NodeDto> {
    return await this.nodeService.move(id, dto.newParentId ?? null);
  }



  @Get(':id/path')
  @ApiOperation({
    summary: "Получение пути к текущей директории",
    description: `
      Получение пути к текущей директории по переданному id.
      `
  })
  async getPath(@Param('id') id: string,): Promise<PathPart[]> {
    return await this.nodeService.getPath(id);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Удаление node',
    description: 'Удаляет node по id вместе со всеми дочерними node-ами и связанными сущностями.',
  })
  async remove(@Param('id', new CustomParseUUIDPipe()) id: string): Promise<NodeDto> {
    return await this.nodeService.delete(id);
  }
}
export { NodeService };

