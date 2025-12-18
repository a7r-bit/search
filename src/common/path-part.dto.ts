import { ApiProperty } from "@nestjs/swagger";

export class PathPart {
    @ApiProperty({
        description: 'ID node',
        type: String,
        nullable: true,
        example: null,
    })
    id: string | null;

    @ApiProperty({
        description: 'Название node',
        example: 'Документы',
    })
    name: string;
}