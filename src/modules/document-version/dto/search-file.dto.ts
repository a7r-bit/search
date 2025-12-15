import { IsString } from "class-validator";

export class SearchFileDto {

    currentDirectoryId: string | null;

    @IsString()
    searchQuery: string;
}