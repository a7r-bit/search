import { Module } from '@nestjs/common';
import { PoliticService } from './politic.service';
import { PoliticController } from './politic.controller';

@Module({
  controllers: [PoliticController],
  providers: [PoliticService],
  exports: [PoliticService]
})
export class PoliticModule { }
