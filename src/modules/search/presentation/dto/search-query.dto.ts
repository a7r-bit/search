import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Kind, MatchType } from './search.types';

export class SearchQuery {
    @IsString()
    @IsNotEmpty()
    readonly query: string;

    @IsEnum(Kind)
    readonly kind: Kind = Kind.UNSPECIFIED;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    readonly externalIds: string[];

    @IsOptional()
    @IsEnum(MatchType)
    readonly matchType: MatchType = MatchType.MILTI_MATCH;

    @IsOptional()
    readonly page: number = 1;

    @IsOptional()
    readonly limit: number = 10;
}
