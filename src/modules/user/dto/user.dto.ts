import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PermissionDTO {
    @ApiProperty({ example: '6a769c84-8fc4-4c09-a6cc-e88cb81e4eeb' })
    id: string;

    @ApiProperty({ example: 'client:read' })
    name: string;
}

export class RoleDTO {
    @ApiProperty({ example: 'a5f32fd2-b2cb-4d04-9634-e46709657c46' })
    id: string;

    @ApiProperty({ example: 'Admin' })
    name: string;

    @ApiPropertyOptional({ type: [PermissionDTO] })
    permissions?: PermissionDTO[];
}

export class UserDTO {
    @ApiProperty({ example: '0302c8a9-50e1-4328-83db-1b3473a970d5' })
    id: string;

    @ApiProperty({ example: '1000' })
    uidNumber: string;

    @ApiProperty({ example: 'Иван' })
    firstName: string;

    @ApiProperty({ example: 'Иванович' })
    middleName: string;

    @ApiPropertyOptional({ type: [RoleDTO] })
    roles?: RoleDTO[];
}
