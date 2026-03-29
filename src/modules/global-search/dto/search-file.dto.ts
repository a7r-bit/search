import { IsOptional, IsString, IsUUID } from 'class-validator';

export class SearchFileDto {
    @IsOptional()
    @IsUUID()
    currentNodeId: string | null;

    @IsString()
    searchQuery: string;
}
