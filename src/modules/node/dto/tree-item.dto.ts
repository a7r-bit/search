import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ConversionStatus, NodePermissionType } from '@prisma/client';

export class TreeDocumentDto {
    @ApiProperty({ description: 'ID последней версии документа', format: 'uuid' })
    latestVersionId: string;

    @ApiProperty({ description: 'Номер версии документа' })
    version: number;

    @ApiProperty({ description: 'Имя файла' })
    fileName: string;

    @ApiProperty({ description: 'Статус конвертации', enum: ConversionStatus })
    conversionStatus: ConversionStatus;

    @ApiProperty({ description: 'Дата обновления', type: String, format: 'date-time' })
    updatedAt: Date;
}

export class TreeItemDto {
    @ApiProperty({ description: 'ID узла', format: 'uuid' })
    id: string;

    @ApiProperty({ description: 'ID родительского узла', format: 'uuid', nullable: true })
    parentId: string | null;

    @ApiProperty({ description: 'Тип элемента в дереве', enum: ['directory', 'file'] })
    kind: 'directory' | 'file';

    @ApiProperty({ description: 'Название элемента' })
    name: string;

    @ApiProperty({ description: 'Есть ли дочерние элементы' })
    hasChildren: boolean;

    @ApiProperty({ description: 'Права доступа к элементу', enum: NodePermissionType, isArray: true })
    permissions: NodePermissionType[];

    @ApiPropertyOptional({ description: 'Информация о документе', type: TreeDocumentDto, nullable: true })
    document?: TreeDocumentDto | null;
}
