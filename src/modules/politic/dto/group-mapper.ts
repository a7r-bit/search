import { Group } from '@prisma/client';
import { GroupDTO } from '../../../common/types/group-dto';

export function toGroupDTO(n: Group): GroupDTO {
    return {
        id: n.id,
        name: n.name,
    };
}
