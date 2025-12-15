import { Module } from '@nestjs/common';
import { GotenbergService } from './gotenberg.service';
import { GotenbergController } from './gotenberg.controller';

@Module({
  controllers: [GotenbergController],
  providers: [GotenbergService],
  exports: [GotenbergService]
})
export class GotenbergModule { }
