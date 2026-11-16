import { Test, TestingModule } from '@nestjs/testing';
import { SearchService } from './search.service';
import { SearchApiClient } from '../../../shared/infrastructure/http/clients/search-api.client';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service';
import { NodeTreeRepository } from '../../node/domain/node-tree.repository';

describe('SearchService', () => {
    let service: SearchService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SearchService,
                {
                    provide: SearchApiClient,
                    useValue: {
                        search: jest.fn(),
                        index: jest.fn(),
                        update: jest.fn(),
                        delete: jest.fn(),
                    },
                },
                {
                    provide: PrismaService,
                    useValue: {
                        node: { findMany: jest.fn() },
                        documentVersion: { findMany: jest.fn() },
                    },
                },
                {
                    provide: NodeTreeRepository,
                    useValue: {
                        getPath: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<SearchService>(SearchService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
