import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { NodeService } from './node.service';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { CreateNodeDto } from './dto/create-node.dto';
import { ListNodesQueryDto } from './dto/list-nodes.query';
import { CustomParseUUIDPipe } from 'src/common/pipes';
import { MoveNodeDto, UpdateNodeDto } from './dto';

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
  async create(@Body() dto: CreateNodeDto) {
    return await this.nodeService.create(dto);
  }

  @Get('children')
  @ApiOperation({
    summary: "Получение дочерних элементов",
    description: `
      Получение дочерних элементов директори`
  })
  async findChildren(@Query() query: ListNodesQueryDto) {
    return await this.nodeService.listChildren(query.parentId ?? null);
  }

  @Get(':id')
  async findById(@Param('id', new CustomParseUUIDPipe()) id: string) {
    return await this.nodeService.findById(id);
  }


  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateNodeDto) {
    return await this.nodeService.update(id, dto);
  }

  @Post(':id/move')
  async move(@Param('id') id: string, @Body() dto: MoveNodeDto) {
    return await this.nodeService.move(id, dto.newParentId ?? null);
  }



  @Get(':id/path')
  @ApiOperation({
    summary: "Получение пути к текущей директории",
    description: `
      Получение пути к текущей директории по переданному id.
      `
  })
  async getPath(@Param('id') id: string,) {
    return await this.nodeService.getPath(id);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Удаление node',
    description: 'Удаляет node по id вместе со всеми дочерними директориями и документами.',
  })

  async remove(@Param('id', new CustomParseUUIDPipe()) id: string) {
    return await this.nodeService.delete(id);
  }
}
export { NodeService };

