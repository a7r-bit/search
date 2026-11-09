import { Injectable } from '@nestjs/common';
import ContextStorageService from '../../domain/interfaces/contextStorageService';
import { CLS_ID, ClsService } from 'nestjs-cls';
@Injectable()
export class NestjsClsContextStorageService implements ContextStorageService {
    constructor(private readonly cls: ClsService) {}

    setContextId(contextId: string): void {
        this.cls.set(CLS_ID, contextId);
    }
    getContextId(): string {
        return this.cls.getId();
    }
    get<T>(key: string): T | undefined {
        return this.cls.get(key);
    }
    set<T>(key: string, value: T): void {
        this.cls.set(key, value);
    }
}
