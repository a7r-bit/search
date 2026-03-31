import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

export class MoveNodeDto {
    @ApiProperty({ description: 'родительский nodeId type = DIRECTORY' })
    @IsOptional()
    @IsUUID()
    newParentId?: string | null;
}
