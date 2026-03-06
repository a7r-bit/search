import { Controller, Get, Req } from '@nestjs/common';
import { PoliticService } from './politic.service';

@Controller('politic')
export class PoliticController {
  constructor(private readonly politicService: PoliticService) { }

  @Get()
  async getByUserId(@Req() req) {
    return this.politicService.getPoliticsByUserId(req.user.id);
  }
}
