import { Controller, Post, UseGuards, Body, Get } from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { User } from '../../../shared/presentation/decorators/user.decorator';
import { LdapUserPayload } from '../../ldap/domain/ldap.user.payload';
import { RequestUser } from '../../../shared/domain/types/request-user';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiBody,
    ApiCreatedResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SignInUserResponse } from './dto/sign_in_user.dto';
import { SignInDto } from './dto/sign_in.dto';
import { LdapAuthGuard } from '../../../shared/presentation/guards/ldap-auth.guard';
import { Public } from '../../../shared/presentation/decorators/public.decorator';
import { UserDTO } from '../../user/presentation/dto/user.dto';
import { SwitchRoleDto } from './dto/switch-role.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    @Public()
    @UseGuards(LdapAuthGuard)
    @Post('signIn')
    @ApiOperation({
        summary: 'Вход пользователя через ldap',
        description: `
    Аутентификация по учетным данным LDAP.
    При успешном входе данные пользователя (ФИО, группы, роли) синхронизируются с системой.
  `,
    })
    @ApiCreatedResponse({ type: SignInUserResponse })
    @ApiUnauthorizedResponse({
        schema: {
            example: {
                message: 'Unauthorized',
                statusCode: 401,
            },
        },
    })
    @ApiBody({ required: true, type: SignInDto })
    async login(@User() user: LdapUserPayload) {
        return await this.authService.signIn(user);
    }

    @Post('switch-role')
    @ApiBearerAuth('access-token')
    @ApiOperation({
        summary: 'Смена активной роли пользователя',
        description: `
    Позволяет сменить активную роль пользователя.
    При успешном входе данные пользователя (ФИО, группы, роли) синхронизируются с системой.`,
    })
    @ApiCreatedResponse({ type: SignInUserResponse })
    @ApiBadRequestResponse({
        description: 'Токен не передан в request',
        schema: {
            example: {
                message: 'Пользователь не найден',
                error: 'Bad Request',
                statusCode: 400,
            },
        },
    })
    @ApiBody({ required: true, type: SwitchRoleDto })
    @ApiNotFoundResponse({
        description: 'Роль с указанным названием не найдена',
        schema: {
            example: {
                message: 'Роль Adminn не найдена',
                error: 'Not Found',
                statusCode: 404,
            },
        },
    })
    async switchRole(@User() user: RequestUser, @Body() body: SwitchRoleDto) {
        return await this.authService.switchRole(user, body.requireRole);
    }
    @Get('me')
    @ApiBearerAuth('access-token')
    @ApiOperation({
        summary: 'Получение информации о текущем пользователе',
        description: 'Получение информации о текущем пользователе',
    })
    @ApiOkResponse({ type: UserDTO })
    async getMe(@User() user: RequestUser) {
        return await this.authService.getMe(user);
    }

    @Post('signOut')
    @ApiBearerAuth('access-token')
    @ApiOperation({
        summary: 'Выход пользователя из системы',
        description: 'Выход пользователя из системы',
    })
    async signOut(@User() user: RequestUser) {
        return await this.authService.signOut(user);
    }
}
