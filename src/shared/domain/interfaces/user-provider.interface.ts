import { UserInfo } from '../types/user-info';

export const USER_PROVIDER = Symbol();
export interface UserProvider {
    findOne(id: string): Promise<UserInfo>;
}
