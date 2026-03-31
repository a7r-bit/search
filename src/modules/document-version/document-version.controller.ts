import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseInterceptors,
    UploadedFile,
    ParseFilePipe,
    MaxFileSizeValidator,
    BadRequestException,
    Query,
} from '@nestjs/common';
import { DocumentVersionService } from './document-version.service';
import { CreateDocumentVersionDto } from './dto/create-document-version.dto';
import { UpdateDocumentVersionDto } from './dto/update-document-version.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { DocumentVersionDto } from './dto/document-version.dto';
import {
    ApiBearerAuth,
    ApiBody,
    ApiConsumes,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiResponse,
} from '@nestjs/swagger';
import { DocumentVersionSortParamsEnum } from './dto/document_version_sort_params_enum.dto';
import { DocumentVersionFilterDto } from './dto/document_version_filter_dto ';
import { ApiSortingQuery } from '../../common/decorators/sorting-params-swagger.decorator';
import { CustomFileTypeValidator, CustomParseUUIDPipe } from '../../common/pipes';
import { SortingParam, SortingParams } from '../../common/decorators/sorting-params.decorator';
@ApiBearerAuth('access-token')
@Controller('document-versions')
export class DocumentVersionController {
    constructor(private readonly documentVersionService: DocumentVersionService) {}

    @Get()
    @ApiOperation({
        summary: 'Получение всех версий документов',
    })
    async findAll(): Promise<DocumentVersionDto[]> {
        return await this.documentVersionService.findAll();
    }

    @Get(':id/node')
    @ApiOperation({
        summary: 'Получение версий для конкретного документа',
        description: `Получение версий документов со ссылками на файл по переданному id документа`,
    })
    @ApiSortingQuery(['version', 'createdAt', 'updatedAt', 'fileName'])
    @ApiParam({
        name: 'id',
        type: 'string',
        required: true,
        description: 'UUID документа',
    })
    @ApiOkResponse({
        type: DocumentVersionDto,
        isArray: true,
        description: 'Список версий документа',
    })
    async findByNodeId(
        @Param('id', new CustomParseUUIDPipe()) documentId: string,
        @Query() filterDto: DocumentVersionFilterDto,
        @SortingParams([...Object.values(DocumentVersionSortParamsEnum)])
        sort?: SortingParam,
    ): Promise<DocumentVersionDto[]> {
        return await this.documentVersionService.findByNodeId(documentId, filterDto, sort);
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Получение версии для конкретного документа',
        description: `
    Получение версии документа со ссылками на файл по переданному id документа`,
    })
    @ApiParam({
        name: 'id',
        type: 'string',
        required: true,
        description: 'UUID документа',
    })
    @ApiOkResponse({
        type: DocumentVersionDto,
        isArray: false,
        description: 'Версия документа',
    })
    async findOne(@Param('id', new CustomParseUUIDPipe()) id: string): Promise<DocumentVersionDto> {
        return await this.documentVersionService.findOneById(id);
    }

    @Post()
    @ApiOperation({
        summary: 'Создание новой версии документа',
        description: `Создание новой версии документа, передавая nodeId и файл.
  Поддерживаемые типы файлов: .doc, .docx, .pdf. Максимальный размер — 5MB.`,
    })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Форма для загрузки файла и указания ID node',
        schema: {
            type: 'object',
            properties: {
                nodeId: {
                    type: 'string',
                    format: 'uuid',
                    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
                },
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'Файл документа (.pdf, .doc, .docx)',
                },
            },
            required: ['nodeId', 'file'],
        },
    })
    @ApiCreatedResponse({
        description: 'Успешное создание версии документа',
        type: DocumentVersionDto,
    })
    @ApiResponse({
        status: 404,
        description: 'Запись о документе не найденаы',
        example: {
            message: 'Формат файла "application/zip" не поддерживается. Разрешены: PDF, DOC, DOCX.',
            error: 'Bad Request',
            statusCode: 400,
        },
    })
    @ApiResponse({
        status: 400,
        description: 'Неподдерживаемый формат файла или превышение размера',
        example: {
            message: 'Запись не найдена',
            error: 'Not Found',
            statusCode: 404,
        },
    })
    @UseInterceptors(
        FileInterceptor('file', {
            storage: memoryStorage(),
        }),
    )
    async create(
        @Body() createDocumentVersionDto: CreateDocumentVersionDto,
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new CustomFileTypeValidator(
                        /(application\/msword|application\/vnd.openxmlformats-officedocument.wordprocessingml.document|application\/pdf)$/,
                    ),
                    new MaxFileSizeValidator({
                        maxSize: 1024 * 1024 * 5,
                        message: `Размер файла не может превышать 5МБ`,
                    }),
                ],
                exceptionFactory: (error) => new BadRequestException(error),
            }),
        )
        file: Express.Multer.File,
    ): Promise<DocumentVersionDto> {
        return await this.documentVersionService.create(createDocumentVersionDto, file);
    }

    @Patch(':id')
    @ApiOperation({
        summary: `Обновление версии документа`,
        description: `Обновление версии или названия файла переданного в параметраъ`,
    })
    @ApiResponse({
        description: 'Успешное обновление версии документа',
        type: DocumentVersionDto,
    })
    async updateDocumentVersion(
        @Param('id', new CustomParseUUIDPipe()) documentVersionId: string,
        @Body() update: UpdateDocumentVersionDto,
    ): Promise<DocumentVersionDto> {
        return this.documentVersionService.update(documentVersionId, update);
    }

    @Delete(':id')
    @ApiOperation({
        summary: 'Удаление версии документа',
        description: 'Удаление версии документов по переданному id',
    })
    @ApiResponse({
        status: 200,
        description: 'Версия документа успешно удалена',
        type: DocumentVersionDto,
    })
    @ApiResponse({
        status: 404,
        description: 'Запись о документе не найдена',
    })
    async remove(@Param('id', new CustomParseUUIDPipe()) id: string): Promise<DocumentVersionDto> {
        return await this.documentVersionService.remove(id);
    }
}
