import { Controller, Post } from '@nestjs/common';
import { PoliticService } from './politic.service';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('politic')
@ApiBearerAuth('access-token')
export class PoliticController {
    constructor(private readonly politicService: PoliticService) {}
    @Post()
    async syncGroups() {
        return await this.politicService.syncGroups();
    }
}
