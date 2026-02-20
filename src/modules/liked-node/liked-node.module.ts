import { Module } from '@nestjs/common';
import { LikedNodeService } from './liked-node.service';
import { LikedNodeController } from './liked-node.controller';

@Module({
  controllers: [LikedNodeController],
  providers: [LikedNodeService],
  exports: [LikedNodeService]
})
export class LikedNodeModule { }
