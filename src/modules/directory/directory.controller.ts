import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CreateDirectoryDto } from './dto/create-directory.dto';
import { UpdateDirectoryDto } from './dto/update-directory.dto';
import { CustomParseUUIDPipe } from 'src/common/pipes/custom-parse-uuid.pipe';
import { DirectoryDTO, PathPart } from './dto';
import { ApiOkResponse, ApiOperation, ApiBody } from '@nestjs/swagger';
import { DirectoryService } from './directory.service';

@Controller('directories')
export class DirectoryController {
  constructor(private readonly directoryService: DirectoryService) { }

  @Get()
  async findAll(): Promise<DirectoryDTO[]> {
    return await this.directoryService.findAll();
  }

  @Get('children')
  @ApiOperation({
    summary: "Получение дочерних элементов директории",
    description: `
    Получение дочерних элементов директории переданной через @Query('parentId')  parentId?: string.
    `
  })
  @ApiOkResponse({
    description: "Успешный ответ", example: [
      {
        "id": "0956eb65-d31b-4f67-a178-57368449cc0d",
        "type": "document",
        "name": "Документ для корня",
        "description": "Описание для корня",
        "parentId": "ee99ddf7-8174-471d-bfe7-5666c9e4f710",
        "createdAt": "2025-09-29T11:39:20.491Z",
        "updatedAt": "2025-09-29T18:42:26.590Z"
      },
      {
        "id": "a9477640-7812-41ba-a616-2f124a6ecc98",
        "type": "directory",
        "name": "Каталог 1.0",
        "parentId": "ee99ddf7-8174-471d-bfe7-5666c9e4f710",
        "createdAt": "2025-09-24T10:29:54.059Z",
        "updatedAt": "2025-09-24T10:29:38.169Z"
      },
      {
        "id": "04ba1481-3a21-4c3a-993d-6f07758ae228",
        "type": "directory",
        "name": "Каталог 1.1",
        "parentId": "ee99ddf7-8174-471d-bfe7-5666c9e4f710",
        "createdAt": "2025-09-26T07:44:47.305Z",
        "updatedAt": "2025-09-26T07:44:47.305Z"
      }
    ]
  })
  async findChildren(
    @Query('parentId') parentId?: string,
  ): Promise<any[]> {
    return await this.directoryService.findChildren(parentId ?? null);
  }

  @Get('path/root')
  async getRootPath(): Promise<PathPart[]> {
    return await this.directoryService.getPath(null);
  }



  @Get(':id/path')
  @ApiOperation({
    summary: "Получение пути к текущей директории",
    description: `
    Получение пути к текущей директории по переданному id.
    `
  })
  @ApiOkResponse({
    description: "Успешный ответ", example:
      [
        {
          "id": null,
          "name": "..."
        },
        {
          "id": "ee99ddf7-8174-471d-bfe7-5666c9e4f710",
          "name": "Корневой каталог"
        },
        {
          "id": "04ba1481-3a21-4c3a-993d-6f07758ae228",
          "name": "Каталог 1.1"
        }
      ]

  })
  async getPath(
    @Param('id') id?: string,
  ): Promise<PathPart[]> {
    return await this.directoryService.getPath(id ?? null);
  }

  @Get(':id')
  async findOne(@Param('id', new CustomParseUUIDPipe()) id: string) {
    return await this.directoryService.findOne(id);
  }



  @Post()
  @ApiOperation({
    summary: 'Создание директории',
    description: 'Создание новой директории. Передайте название директории и id родительской директории.',
  })
  @ApiBody({
    type: CreateDirectoryDto,
    required: true,
    description: 'Данные для создания директории',
    examples: {
      default: {
        summary: 'Пример создания директории',
        value: {
          name: 'Новая директория',
          parentId: 'ee99ddf7-8174-471d-bfe7-5666c9e4f710'
        }
      }
    }
  })
  @ApiOkResponse({
    type: DirectoryDTO,
    description: 'Успешный ответ. Возвращает созданную директорию.',

  })
  async create(@Body() createDirectoryDto: CreateDirectoryDto): Promise<DirectoryDTO> {
    return await this.directoryService.create(createDirectoryDto);
  }



  @Patch(':id')
  @ApiOperation({
    summary: 'Обнавление директории',
    description: 'Обновление директории. Передайте название директории и id.',
  })
  @ApiBody({
    type: UpdateDirectoryDto,
    required: true,
    description: 'Данные для обнавления директории',

  })
  @ApiOkResponse({
    type: DirectoryDTO,
    description: 'Успешный ответ. Возвращает обнавленную директорию.',

  })
  async update(@Param('id') id: string, @Body() updateDirectoryDto: UpdateDirectoryDto): Promise<DirectoryDTO> {

    return await this.directoryService.update(id, updateDirectoryDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Удаление директории',
    description: 'Удаляет директорию по id вместе со всеми дочерними директориями и документами.',
  })
  @ApiOkResponse({
    description: 'Успешный ответ. Возвращает удалённую директорию.',
    type: DirectoryDTO,
  })
  async remove(@Param('id', new CustomParseUUIDPipe()) id: string): Promise<DirectoryDTO> {
    return await this.directoryService.remove(id);
  }
}
