import { Test, TestingModule } from '@nestjs/testing';
import { SearchService } from './search.service';
import { SearchApiClient } from '../../infrastructure/http/clients/search-api.client';

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
            ],
        }).compile();

        service = module.get<SearchService>(SearchService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
