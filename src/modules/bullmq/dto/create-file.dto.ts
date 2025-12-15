import { IsNotEmpty, IsString } from "class-validator"

export class CreateFileDto {
    @IsString()
    @IsNotEmpty()
    filePath: string

    @IsString()
    @IsNotEmpty()
    fileName: string

    @IsString()
    @IsNotEmpty()
    extention: string

    @IsString()
    @IsNotEmpty()
    documentVersionId: string

}