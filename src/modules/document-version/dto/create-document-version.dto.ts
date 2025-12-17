import { IsNotEmpty, IsString, IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateDocumentVersionDto {
    @ApiProperty({
        description: 'UUID документа, к которому добавляется новая версия',
        example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
        format: 'uuid',
    })
    @IsString()
    @IsNotEmpty()
    @IsUUID()
    nodeId: string;


}
