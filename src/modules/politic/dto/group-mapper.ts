import { GroupDTO } from "./group-dto";

export function toGroupDTO(n: any): GroupDTO {
    return {
        id: n.id,
        name: n.name
    }
}