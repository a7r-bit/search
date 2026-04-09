import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, Max, Min } from 'class-validator';

export class FindUserQueryDto {
    @ApiPropertyOptional({
        description: 'Включать ли роли пользователя',
        example: true,
        type: Boolean,
    })
    @IsOptional()
    @IsBoolean({ message: 'includeRoles must be a boolean value' })
    @Transform(({ value }) => {
        if (value === 'true') return true;
        if (value === 'false') return false;
        if (value === '1') return true;
        if (value === '0') return false;
        return value;
    })
    includeRoles?: boolean;

    @ApiPropertyOptional({
        description: 'Включать ли права (permissions) у ролей',
        example: true,
        type: Boolean,
    })
    @IsOptional()
    @IsBoolean({ message: 'includePermissions must be a boolean value' })
    @Transform(({ value }) => {
        if (value === 'true') return true;
        if (value === 'false') return false;
        if (value === '1') return true;
        if (value === '0') return false;
        return value;
    })
    includePermissions?: boolean;

    @ApiPropertyOptional({
        description: 'Номер страницы',
        default: 1,
        minimum: 1,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @ApiPropertyOptional({
        description: 'Элементов на странице',
        default: 10,
        minimum: 1,
        maximum: 100,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    perPage?: number = 10;
}
