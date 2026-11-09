import { ApiProperty } from '@nestjs/swagger';

export class TokensDto {
    @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
    access_token: string;

    @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
    refresh_token: string;
}

export class UserDto {
    @ApiProperty({ example: '2230971f-6578-461b-8160-04a102b15f5a' })
    id: string;

    @ApiProperty({ example: '1000' })
    uidNumber: string;

    @ApiProperty({ example: 'Jon' })
    firstName: string;

    @ApiProperty({ example: 'Doner' })
    middleName: string;

    @ApiProperty({ example: 'Admin' })
    activeRole: string;

    @ApiProperty({ example: ['Admin', 'User'], isArray: true })
    roles: string[];
}

export class SignInUserResponse {
    @ApiProperty({ type: TokensDto })
    tokens: TokensDto;

    @ApiProperty({ type: UserDto })
    user: UserDto;
}
