import { ApiProperty } from "@nestjs/swagger";

export class PathPart {
    @ApiProperty({
        description: 'ID директории, null для корня',
        type: String,
        nullable: true,
        example: null,
    })
    id: string | null;

    @ApiProperty({
        description: 'Название директории',
        example: 'Документы',
    })
    name: string;
}