import { IsString } from "class-validator";

export class SearchFileDto {

    currentNodeId: string | null;

    @IsString()
    searchQuery: string;
}