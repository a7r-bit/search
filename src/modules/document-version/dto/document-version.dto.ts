import { ApiProperty } from '@nestjs/swagger';
import { MediaFileDto } from './media-file.dto';
import { ConversionStatus, Prisma } from '@prisma/client';

type DocumentVersionWithFile = Prisma.DocumentVersionGetPayload<{
    include: { mediaFile: true };
}>;


export class DocumentVersionDto {
    constructor(documentVersion: DocumentVersionWithFile,) {
        this.id = documentVersion.id
        this.version = documentVersion.version
        this.nodeId = documentVersion.nodeId
        this.conversionStatus = documentVersion.conversionStatus
        this.mediaFile = documentVersion.mediaFile ? new MediaFileDto(documentVersion.mediaFile) : null
        this.createdAt = documentVersion.createdAt.toISOString()
        this.updatedAt = documentVersion.updatedAt.toISOString()
    }


    @ApiProperty({ description: 'ID версии документа', type: String })
    id: string;

    @ApiProperty({ description: 'Номер версии', type: Number })
    version: number;

    @ApiProperty({ description: 'ID документа', type: String })
    nodeId: string;

    @ApiProperty({ description: 'Статус конвертации', enum: ConversionStatus })
    conversionStatus: ConversionStatus;

    @ApiProperty({ description: 'Файл, связанный с версией документа', type: MediaFileDto, nullable: true })
    mediaFile: MediaFileDto | null;

    @ApiProperty({ description: 'Дата создания', type: String })
    createdAt: string;

    @ApiProperty({ description: 'Дата обновления', type: String })
    updatedAt: string;
}