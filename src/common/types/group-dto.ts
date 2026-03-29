import { ApiProperty } from '@nestjs/swagger';

export class GroupDTO {
    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;
}
