import { Module } from '@nestjs/common';
import { LikedDirectoryService } from './liked-directory.service';
import { LikedDirectoryController } from './liked-directory.controller';

@Module({
  controllers: [LikedDirectoryController],
  providers: [LikedDirectoryService],
})
export class LikedDirectoryModule {}
