import { ApiProperty } from "@nestjs/swagger";
import { Document } from "@prisma/client";
import { ModelType } from "src/common/constants";

export class DocumentDTO {
    constructor(document: Document, type: ModelType) {
        this.id = document.id;
        this.type = type;
        this.title = document.title;
        this.description = document.description;
        this.directoryId = document.directoryId;
        this.createdAt = document.createdAt.toISOString();
        this.updatedAt = document.updatedAt.toISOString();


    }

    @ApiProperty({
        description: 'Уникальный идентификатор',
        example: 'a9477640-7812-41ba-a616-2f124a6ecc98',
    })
    id: string;

    @ApiProperty({
        description: 'Тип узла: директория или документ',
        enum: ModelType,
        example: ModelType.Document,
    })
    type: ModelType;

    @ApiProperty({
        description: 'Имя файла или директории',
        example: 'Отчёты',
    })
    title: string;

    @ApiProperty({
        description: 'Описание документа',
        required: false,
        example: 'Финансовый отчёт за 2023 год',
    })
    description: string | null;

    @ApiProperty({
        description: 'ID родительской директории',
        type: String,
    })
    directoryId: string;


    @ApiProperty({
        description: 'Дата создания',
        example: '2025-09-29T10:15:30.000Z',
    })
    createdAt: string;

    @ApiProperty({
        description: 'Дата последнего обновления',
        example: '2025-09-29T12:47:00.000Z',
    })
    updatedAt: string;
}