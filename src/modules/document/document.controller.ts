import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DocumentService } from './document.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { CustomParseUUIDPipe } from 'src/common/pipes/custom-parse-uuid.pipe';
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam } from '@nestjs/swagger';
import { DocumentDTO } from './dto/document.dto';

@Controller('documents')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) { }

  @Get()
  async findAll() {
    return await this.documentService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Получение объекта документа',
    description: `
      Получение объекта документа по переданному id документа`,
  })
  @ApiParam({ name: "id", type: 'string', required: true, description: "UUID документа" })

  @ApiOkResponse({
    type: DocumentDTO,
    isArray: false,
    description: 'Объекта документа',
  })
  async findOne(@Param('id', new CustomParseUUIDPipe) id: string): Promise<DocumentDTO> {
    return await this.documentService.findOne(id);
  }



  @Post()
  @ApiOperation({
    summary: 'Создание объекта документа',
    description: 'СОздание объекта документа передавая параметры в тело запроса.',
  })
  @ApiBody({ type: CreateDocumentDto })
  @ApiCreatedResponse({
    type: DocumentDTO,
    example: {
      "id": "a9477640-7812-41ba-a616-2f124a6ecc98",
      "type": "document",
      "name": "Документ отчета",
      "parentId": "366a301b-3c4e-4d8b-a894-83e792734792",
      "description": "Финансовый отчёт за 2023 год",
      "createdAt": "2025-09-29T10:15:30.000Z",
      "updatedAt": "2025-09-29T12:47:00.000Z"
    },
    description: 'Документ успешно создан',

  })

  async create(@Body() createDocumentDto: CreateDocumentDto): Promise<DocumentDTO> {
    return await this.documentService.create(createDocumentDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: `Обнавление объекта документа`, description: `Обновление объекта документа по переданном параметрам` })
  @ApiBody({ type: UpdateDocumentDto })
  async update(@Param('id', new CustomParseUUIDPipe()) id: string, @Body() updateDocumentDto: UpdateDocumentDto): Promise<DocumentDTO> {
    return await this.documentService.update(id, updateDocumentDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Удаление документа',
    description: 'Удаляет документ по id и связанные с ним файлы на диске.',
  })
  @ApiParam({ name: "id", type: 'string', required: true, description: "UUID документа" })
  @ApiOkResponse({
    type: DocumentDTO,

    description: 'Успешный ответ. Возвращает удалённый документ.',
  })
  async remove(@Param('id', new CustomParseUUIDPipe()) id: string): Promise<DocumentDTO> {
    return await this.documentService.remove(id);
  }
}
