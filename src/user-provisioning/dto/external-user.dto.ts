import { ExternalGroup } from './external-group.dto';

export class ExternalUserPayload {
    uidNumber: string;
    firstName: string;
    middleName: string;
    departments: ExternalGroup[];
}
