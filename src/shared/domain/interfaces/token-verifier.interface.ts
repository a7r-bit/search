import { AccessTokenPayload } from '../types/access-token-payload';

export const TOKEN_VERIFIER = Symbol();

export interface TokenVerifier {
    verifyAccessToken(token: string): Promise<AccessTokenPayload>;
}
