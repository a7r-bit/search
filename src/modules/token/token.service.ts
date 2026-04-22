import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PayloadDTO } from './dto/payload.dto';
import { PrismaService } from '../prisma';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TokenService {

    private readonly accessSecret: string;
    private readonly refreshSecret: string;
    private readonly accessExpires: string;
    private readonly refreshExpires: string;

    constructor(
        private readonly jwtService: JwtService,
        private readonly prisma: PrismaService,
        private readonly config: ConfigService,
    ) {
        this.accessSecret = this.config.get<string>('ACCESS_SECRET_KEY', '');
        this.refreshSecret = this.config.get<string>('REFRESH_SECRET_KEY', '');
        this.accessExpires = this.config.get<string>('JWT_EXPIRES_IN_ACCESS', '15m');
        this.refreshExpires = this.config.get<string>('JWT_EXPIRES_IN_REFRESH', '7d');

        if (!this.accessSecret || !this.refreshSecret) {
            throw new Error('ACCESS_SECRET_KEY and REFRESH_SECRET_KEY must be configured');
        }
    }

    private async generateAccessToken(payload: PayloadDTO): Promise<string> {
        return await this.jwtService.signAsync(payload, {
            expiresIn: this.accessExpires as any,
            secret: this.accessSecret,
        });
    }

    private async generateRefreshToken(payload: PayloadDTO): Promise<string> {
        return await this.jwtService.signAsync(payload, {
            expiresIn: this.refreshExpires as any,
            secret: this.refreshSecret,
        });
    }

    async verifyAccessToken(access_token: string): Promise<PayloadDTO> {
        return await this.jwtService.verify(access_token, {
            secret: this.accessSecret,
        });
    }

    async verifyRefreshToken(refresh_token: string): Promise<PayloadDTO> {
        return await this.jwtService.verify(refresh_token, {
            secret: this.refreshSecret,
        });
    }

    async generateTokens(payload: PayloadDTO) {
        const access_token = await this.generateAccessToken(payload);
        const refresh_token = await this.generateRefreshToken(payload);
        await this.prisma.refreshToken.upsert({
            where: { userId: payload.id },
            update: { token: refresh_token },
            create: { userId: payload.id, token: refresh_token },
        });

        return { access_token: access_token, refresh_token: refresh_token };
    }

    async refreshTokens(refresh_token: string) {
        const payload: PayloadDTO = await this.verifyRefreshToken(refresh_token);

        // Check refresh token in DB
        const stored = await this.prisma.refreshToken.findUnique({ where: { userId: payload.id } });

        if (!stored || stored.token !== refresh_token) {
            throw new UnauthorizedException('Invalid or replayed refresh token');
        }

        // Generate new tokens
        const newPayload: PayloadDTO = {
            id: payload.id,
            activeRole: payload.activeRole,
            politicGroups: payload.politicGroups,
        };

        const newAccess = await this.generateAccessToken(newPayload);
        const newRefresh = await this.generateRefreshToken(newPayload);

        await this.prisma.refreshToken.upsert({
            where: { userId: payload.id },
            update: { token: newRefresh },
            create: { userId: payload.id, token: newRefresh },
        });

        return { access_token: newAccess, refresh_token: newRefresh };
    }

    async remoteRefreshToken(userId: string): Promise<boolean> {
        await this.prisma.refreshToken.deleteMany({ where: { userId: userId } });
        return true;
    }
}