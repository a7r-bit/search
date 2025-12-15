import { forwardRef, Module } from '@nestjs/common';
import { DirectoryService } from './directory.service';
import { DirectoryController } from './directory.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { DocumentModule } from '../document/document.module';
import { SearchModule } from '../search';

@Module({
  imports: [PrismaModule, forwardRef(() => DocumentModule), SearchModule],
  controllers: [DirectoryController],
  providers: [DirectoryService],
  exports: [DirectoryService]
})
export class DirectoryModule { }
