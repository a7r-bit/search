import { Controller, Post } from '@nestjs/common';
import { PoliticService } from './politic.service';

@Controller('politic')
export class PoliticController {
    constructor(private readonly politicService: PoliticService) {}

    // @Get()
    // async getByUserId(@Req() req: any) {
    //     return await this.politicService.getPoliticsByTabNumber(req.user.uidNumber);
    // }

    @Post()
    async syncGroups() {
        return await this.politicService.syncGroups();
    }
}
