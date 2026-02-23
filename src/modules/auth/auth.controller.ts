import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { SignInUserResponse } from './dto/sign_in_user.dto';
import { SignInDto } from './dto/sign_in.dto';
import { LdapAuthGuard } from '../../common/guards/ldap-auth.guard';
import { LdapGroupGuard } from '../../common/guards/ldap-group.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }
  @UseGuards(LdapAuthGuard, LdapGroupGuard)

  @Post("signIn")
  @ApiOperation({
    summary: "Вход пользователя через ldap",
    description: `
    Аутентификация по учетным данным LDAP.  
    При успешном входе данные пользователя (ФИО, группы, роли) синхронизируются с системой.
  `,
  })
  @ApiCreatedResponse({ type: SignInUserResponse, })
  @ApiUnauthorizedResponse({
    schema: {
      example: {
        message: "Unauthorized",
        statusCode: 401
      }
    }
  })
  @ApiBody({ required: true, type: SignInDto })
  async login(@Request() req) {
    return await this.authService.signIn(req)
  }

  @Post("switch-role")
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: "Смена активной роли пользователя",
    description: `
    Позволяет сменить активную роль пользователя.
    При успешном входе данные пользователя (ФИО, группы, роли) синхронизируются с системой.`
  })
  @ApiCreatedResponse({ type: SignInUserResponse })
  @ApiBadRequestResponse({
    description: "Токен не передан в request",
    schema: {
      example: {
        message: "Пользователь не найден",
        error: "Bad Request",
        statusCode: 400,
      },
    },
  })
  @ApiNotFoundResponse({
    description: "Роль с указанным названием не найдена",
    schema: {
      example: {
        message: "Роль Adminn не найдена",
        error: "Not Found",
        statusCode: 404,
      },
    },
  })

  async switchRole(@Request() req, @Body("requireRole") requireRole: string) {
    return await this.authService.switchRole(req, requireRole)
  }



}
