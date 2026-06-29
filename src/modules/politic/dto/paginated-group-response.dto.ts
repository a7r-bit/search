import { GroupDTO } from "../../../common/types/group-dto";

export class PaginatedGroupResponseDto {
    items: GroupDTO[];
    total:number;
    page:number;
    limit:number;
}