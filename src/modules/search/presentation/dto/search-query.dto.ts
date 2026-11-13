import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Kind, MatchType, SortBy } from './search.types';

export class SearchQuery {
    @IsString()
    @IsNotEmpty()
    readonly query: string;

    @IsOptional()
    @IsEnum(Kind)
    readonly kind: Kind = Kind.UNSPECIFIED;

    @IsOptional()
    @IsString()
    readonly externalIds?: string;

    @IsOptional()
    @IsEnum(MatchType)
    readonly matchType: MatchType = MatchType.MULTI_MATCH;

    @IsOptional()
    readonly page: number = 1;

    @IsOptional()
    readonly limit: number = 10;

    @IsOptional()
    @IsEnum(SortBy)
    readonly sortBy: SortBy = SortBy.SCORE;
}
