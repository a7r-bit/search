import { Module } from '@nestjs/common';
import { SyncService } from './sync.service';
import { SyncController } from './sync.controller';
import { PoliticModule } from '../politic';
import { EmployeesParserModule } from '../../infrastructure';

@Module({
  imports:[ PoliticModule, EmployeesParserModule],
  controllers: [SyncController],
  providers: [SyncService],
})
export class SyncModule {}
