import { GroupDTO } from '../../../../shared/domain/types/group-dto';

export class PaginatedGroupResponseDto {
    items: GroupDTO[];
    total: number;
    page: number;
    limit: number;
}
