import { ElasticTypes } from '../../../../common/constants';

export type ESOperation = 'index' | 'update' | 'delete';

export interface ESJobResult {
    success: boolean;
    operation: ESOperation;
    ERROR?: string;
}

export interface ESJobData {
    indexName: ElasticTypes;
    operation: ESOperation;
    id: string;
    body?: any;
}
