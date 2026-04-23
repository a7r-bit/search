import { Controller, Delete, Get, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
    ApiBadRequestResponse,
    ApiBody,
    ApiConsumes,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiProperty,
    ApiQuery,
    ApiTags,
} from '@nestjs/swagger';
import { S3Service } from './s3.service';

class S3FileExistsResponseDto {
    @ApiProperty({ example: true, description: 'Флаг существования файла в S3' })
    exists: boolean;
}

class S3UploadFileResponseDto {
    @ApiProperty({ example: 'original/2f18ee9f-4763-4d5f-bf89-8d205f7c6ca8.pdf', description: 'Ключ загруженного файла в S3' })
    key: string;
}

class S3GetFileUrlResponseDto {
    @ApiProperty({ example: 'https://s3.example.com/bucket/original/file.pdf?...', description: 'Подписанный URL файла' })
    url: string;
}

class S3DeleteFileResponseDto {
    @ApiProperty({ example: 'File deleted successfully', description: 'Результат удаления файла' })
    message: string;
}

class S3UploadFileRequestDto {
    @ApiProperty({ type: 'string', format: 'binary', description: 'Файл для загрузки' })
    file: unknown;
}

@Controller('s3')
@ApiTags('S3')
export class S3Controller {
    constructor(private readonly s3Service: S3Service) {}

    @Get('checkFileExists')
    @ApiOperation({
        summary: 'Проверить существование файла',
        description: 'Проверяет, существует ли файл в S3 по ключу.',
    })
    @ApiQuery({ name: 'key', description: 'Ключ файла в S3', required: true, type: String })
    @ApiOkResponse({ description: 'Результат проверки существования файла', type: S3FileExistsResponseDto })
    @ApiBadRequestResponse({ description: 'Не передан ключ файла' })
    async checkFileExists(@Query('key') key: string): Promise<S3FileExistsResponseDto> {
        const exists = await this.s3Service.checkFileExists(key);
        return { exists };
    }

    @Post('uploadFile')
    @UseInterceptors(FileInterceptor('file'))
    @ApiOperation({
        summary: 'Загрузить файл в S3',
        description: 'Загружает файл в S3 с префиксом original и возвращает ключ сохраненного файла.',
    })
    @ApiConsumes('multipart/form-data')
    @ApiBody({ type: S3UploadFileRequestDto })
    @ApiOkResponse({ description: 'Файл успешно загружен', type: S3UploadFileResponseDto })
    @ApiBadRequestResponse({ description: 'Файл не передан или имеет некорректный формат' })
    async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<S3UploadFileResponseDto> {
        return this.s3Service.uploadFile(file, 'original');
    }

    @Get('getFile')
    @ApiOperation({
        summary: 'Получить временную ссылку на файл',
        description: 'Возвращает подписанный URL для доступа к файлу по ключу в S3.',
    })
    @ApiQuery({ name: 'key', description: 'Ключ файла в S3', required: true, type: String })
    @ApiOkResponse({ description: 'Подписанная ссылка на файл', type: S3GetFileUrlResponseDto })
    @ApiNotFoundResponse({ description: 'Файл с указанным ключом не найден' })
    @ApiBadRequestResponse({ description: 'Не передан ключ файла' })
    async getFile(@Query('key') key: string): Promise<S3GetFileUrlResponseDto> {
        return this.s3Service.getFileUrl(key);
    }

    @Delete('deleteFile')
    @ApiOperation({
        summary: 'Удалить файл из S3',
        description: 'Удаляет файл в S3 по ключу и возвращает результат операции.',
    })
    @ApiQuery({ name: 'key', description: 'Ключ файла в S3', required: true, type: String })
    @ApiOkResponse({ description: 'Файл успешно удален', type: S3DeleteFileResponseDto })
    @ApiBadRequestResponse({ description: 'Не передан ключ файла' })
    async deleteFile(@Query('key') key: string): Promise<S3DeleteFileResponseDto> {
        return this.s3Service.deleteFile(key);
    }
}



