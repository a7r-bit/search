import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PayloadDTO } from './dto/payload.dto';
import { PrismaService } from '../prisma';
import { UserService } from '../user';
import { ACCESS_SECRET_KEY, JWT_EXPIRES_IN_ACCESS, JWT_EXPIRES_IN_REFRESH, REFRESH_SECRET_KEY } from '../../common/constants';

@Injectable()
export class TokenService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
        private readonly prisma: PrismaService,
    ) { }

    private async generateAccessToken(payload: PayloadDTO): Promise<string> {
        return await this.jwtService.signAsync(payload, {
            expiresIn: JWT_EXPIRES_IN_ACCESS,
            secret: ACCESS_SECRET_KEY
        })
    }

    private async generateRefreshToken(payload: PayloadDTO): Promise<string> {
        return await this.jwtService.signAsync(
            payload,
            {
                expiresIn: JWT_EXPIRES_IN_REFRESH,
                secret: REFRESH_SECRET_KEY
            })
    }

    async verifyAccessToken(access_token: string) {
        return await this.jwtService.verify(access_token, { secret: ACCESS_SECRET_KEY })
    }

    async verifyRefreshToken(refresh_token: string) {
        return await this.jwtService.verify(refresh_token, { secret: REFRESH_SECRET_KEY })
    }

    async decodeToken(token: string): Promise<PayloadDTO> {
        return await this.jwtService.decode(token)
    }

    async generateTokens(payload: PayloadDTO) {
        const access_token = await this.generateAccessToken(payload);
        const refresh_token = await this.generateRefreshToken(payload);
        await this.prisma.refreshToken.upsert({
            where: { userId: payload.id },
            update: { token: refresh_token },
            create: { userId: payload.id, token: refresh_token }
        })

        return { access_token: access_token, refresh_token: refresh_token }
    }

    async refreshTokens(refresh_token: string) {
        const payload: PayloadDTO = await this.decodeToken(refresh_token)
        const newAccess = await this.generateAccessToken({ id: payload.id, activeRole: payload.activeRole })
        const newRefresh = await this.generateRefreshToken({ id: payload.id, activeRole: payload.activeRole })
        const user = await this.userService.findOne(payload.id, { includeRoles: true });
        if (!user.role.map(r => r.name).includes(payload.activeRole)) {
            throw new BadRequestException(`Пользователь не имеет доступа к роли ${payload.activeRole}`)
        }
        await this.prisma.refreshToken.upsert({
            where: { userId: payload.id },
            update: { token: refresh_token },
            create: { userId: payload.id, token: refresh_token }
        })

        return { access_token: newAccess, refresh_token: newRefresh }
    }

    async remoteRefreshToken(access_token: string): Promise<boolean> {
        const userData: PayloadDTO = await this.decodeToken(access_token)
        await this.prisma.refreshToken.delete({ where: { userId: userData.id } })
        return true
    }
}
