import { Body, Controller, Post } from '@nestjs/common';
import { TokenService } from './token.service';
import { Public } from '../../common/decorators/public.decorator';
import { ApiBody, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { TokensDto } from '../auth/dto/sign_in_user.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('token')
export class TokenController {
    constructor(private readonly tokenService: TokenService) {}

    @Post('refresh-token')
    @ApiOperation({
        summary: 'Обновить токен',
        description: 'Обновить токен',
    })
    @ApiBody({ type: RefreshTokenDto, required: true })
    @ApiOkResponse({ type: TokensDto })
    @Public()
    async refreshToken(@Body() body: RefreshTokenDto) {
        return await this.tokenService.refreshTokens(body.refresh_token);
    }
}
