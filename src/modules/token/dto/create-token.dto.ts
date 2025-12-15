import { IsJWT, IsString, IsUUID } from "class-validator"

export class CreateTokenDTO {
    @IsString()
    @IsJWT()
    token: string

    @IsString()
    @IsUUID()
    userId: string
}