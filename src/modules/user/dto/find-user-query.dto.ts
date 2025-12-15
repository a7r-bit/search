import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsBoolean, IsOptional } from "class-validator";

export class FindUserQueryDto {
    @ApiPropertyOptional({
        description: "Включать ли роли пользователя",
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
        description: "Включать ли права (permissions) у ролей",
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
}