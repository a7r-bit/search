import { ApiProperty } from '@nestjs/swagger';
import { MediaFile } from '@prisma/client';

export class MediaFileDto {
    constructor(mediaFile: MediaFile) {
        this.id = mediaFile.id;
        this.fileUrl = mediaFile.filePath;
        this.fileName = mediaFile.fileName;
        this.extention = mediaFile.extention;
        this.documentVersionId = mediaFile.documentVersionId;
    }

    @ApiProperty({ description: 'ID файла', type: String })
    id: string;

    @ApiProperty({ description: 'S3 key/URL файла без дополнительной обработки', type: String })
    fileUrl: string;

    @ApiProperty({ description: 'Имя файла без расширения', type: String })
    fileName: string;

    @ApiProperty({
        description: 'Расширение файла (например, pdf, docx)',
        type: String,
    })
    extention: string;

    @ApiProperty({
        description: 'ID версии документа, к которой привязан файл',
        type: String,
        nullable: true,
    })
    documentVersionId: string | null;
}
