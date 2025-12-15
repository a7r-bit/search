import { ApiProperty } from '@nestjs/swagger';
import { ConversionStatus, DocumentVersion, MediaFile, Prisma, } from '@prisma/client';
import { MediaFileDto } from './media-file.dto';
import { ModelType } from 'src/common/constants';

type DocumentVersionWithFile = Prisma.DocumentVersionGetPayload<{
    include: { mediaFile: true };
}>;


export class DocumentVersionDto {
    constructor(documentVersion: DocumentVersionWithFile, type: ModelType,) {
        this.id = documentVersion.id
        this.type = type
        this.version = documentVersion.version
        this.documentId = documentVersion.documentId
        this.conversionStatus = documentVersion.conversionStatus
        this.mediaFile = documentVersion.mediaFile ? new MediaFileDto(documentVersion.mediaFile) : null
        this.createdAt = documentVersion.createdAt.toISOString()
        this.updatedAt = documentVersion.updatedAt.toISOString()
    }


    @ApiProperty({ description: 'ID версии документа', type: String })
    id: string;

    @ApiProperty({
        description: 'Тип узла',
        enum: ModelType,
        example: ModelType.DocumentVersion,
    })
    type: ModelType;

    @ApiProperty({ description: 'Номер версии', type: Number })
    version: number;

    @ApiProperty({ description: 'ID документа', type: String })
    documentId: string;

    @ApiProperty({ description: 'Статус конвертации', enum: ConversionStatus })
    conversionStatus: ConversionStatus;

    @ApiProperty({ description: 'Файл, связанный с версией документа', type: MediaFileDto, nullable: true })
    mediaFile: MediaFileDto | null;

    @ApiProperty({ description: 'Дата создания', type: String })
    createdAt: string;

    @ApiProperty({ description: 'Дата обновления', type: String })
    updatedAt: string;
}