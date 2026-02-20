import { ApiProperty } from '@nestjs/swagger';
import { MediaFile } from 'prisma/generated/prisma/browser';

export class MediaFileDto {
    constructor(mediaFile: MediaFile) {
        this.id = mediaFile.id
        this.fileUrl = '/' + mediaFile.filePath.replace(/\\/g, '/')
        this.fileName = mediaFile.fileName
        this.extention = mediaFile.extention
        this.documentVersionId = mediaFile.documentVersionId
    }

    @ApiProperty({ description: 'ID файла', type: String })
    id: string;

    @ApiProperty({ description: 'URL для доступа к файлу', type: String })
    fileUrl: string;

    @ApiProperty({ description: 'Имя файла без расширения', type: String })
    fileName: string;

    @ApiProperty({ description: 'Расширение файла (например, pdf, docx)', type: String })
    extention: string;

    @ApiProperty({ description: 'ID версии документа, к которой привязан файл', type: String, nullable: true })
    documentVersionId: string | null;





}