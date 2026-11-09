import { Group } from '@prisma/client';
import { GroupDTO } from '../../../../shared/domain/types/group-dto';

export function toGroupDTO(n: Group): GroupDTO {
    return {
        id: n.id,
        name: n.name,
    };
}
