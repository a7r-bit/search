import { Controller, Get, Param, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { FindUserQueryDto, UserDTO } from './dto';
import { UserMapper } from './mappers';
import { ApiBadRequestResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam } from '@nestjs/swagger';
import { CustomParseUUIDPipe } from '../../common/pipes';
import { Scope } from '../../common/decorators/scope.decorator';
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    @ApiOperation({ summary: 'Получение всех пользователей системы' })
    @ApiOkResponse({ type: UserDTO, isArray: true, description: 'Успешное получение' })
    @Scope('client:read')
    async findAll(@Query() query: FindUserQueryDto) {
        const users = await this.userService.findAll(query);
        return users.map((user) => UserMapper.toUserDTO(user as any));
    }

    @Get(':id')
    @ApiOperation({ summary: 'Получить пользователя по ID' })
    @ApiParam({ name: 'id', type: String, description: 'UUID пользователя' })
    @ApiOkResponse({ type: UserDTO, description: 'Успешное получение' })
    @ApiNotFoundResponse({
        description: 'Пользователь не найден',
        schema: {
            example: {
                message: 'Пользователь не найден',
                error: 'Not Found',
                statusCode: 404,
            },
        },
    })
    @ApiBadRequestResponse({
        description: 'Id не валиден',
        schema: {
            example: {
                message: 'ID не валиден.',
                errors: 'Validation failed (uuid is expected)',
            },
        },
    })
    async findOne(@Param('id', new CustomParseUUIDPipe()) id: string) {
        const user = await this.userService.findOne(id, { includeRoles: true });
        return UserMapper.toUserDTO(user);
    }

    @Get('/by-uid_number/:uid')
    @ApiOperation({ summary: 'Получение пользователя по UidNumber' })
    @ApiOkResponse({ type: UserDTO })
    @ApiNotFoundResponse({
        description: 'Пользователь не найден',
        schema: {
            example: {
                message: 'Not Found',
                statusCode: 404,
            },
        },
    })
    async findByUidNumber(@Param('uid') uid: string) {
        const user = await this.userService.findByUidNumber(uid, { includeRoles: true });
        return UserMapper.toUserDTO(user);
    }
}
