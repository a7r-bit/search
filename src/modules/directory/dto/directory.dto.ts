import { ApiProperty } from "@nestjs/swagger";
import { Directory } from "@prisma/client";
import { ModelType } from "src/common/constants";

export class DirectoryDTO {
    constructor(directory: Directory, type: ModelType) {
        this.id = directory.id;
        this.name = directory.name;
        this.type = type;
        this.parentId = directory.parentId;
        this.createdAt = directory.createdAt.toISOString();
        this.updatedAt = directory.updatedAt.toISOString();

    }

    @ApiProperty({
        description: 'Уникальный идентификатор',
        example: 'a9477640-7812-41ba-a616-2f124a6ecc98',
    })
    id: string;

    @ApiProperty({
        description: 'Тип узла',
        enum: ModelType,
        example: ModelType.Directory,
    })
    type: ModelType;

    @ApiProperty({
        description: 'Имя файла или директории',
        example: 'Отчёты',
    })
    name: string;


    @ApiProperty({
        description: 'ID родительской директории, null если на верхнем уровне',
        type: String,
        nullable: true,
        example: null,
    })
    parentId: string | null;

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