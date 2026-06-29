import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString, Min } from "class-validator";

export class ListGroupQueryDto {
    @ApiProperty({description: 'Номер страницы', default: 1,required: false})
    @IsOptional()
    @Type(()=> Number)
    @IsInt()
    @Min(1)
    page: number;

    @ApiProperty({description: 'Количество элементов на странице', default: 20})
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number = 20;

    @ApiProperty({description: 'Поисковый запрос', default: '', required: false})
    @IsOptional()
    @IsString()
    search?:string;
    
}