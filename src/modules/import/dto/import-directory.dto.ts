import { IsOptional, IsString, IsUUID } from 'class-validator';

export class ImportDirectoryDto {
    @IsString()
    path: string;

    @IsOptional()
    @IsUUID()
    parentNodeId?: string;
}
