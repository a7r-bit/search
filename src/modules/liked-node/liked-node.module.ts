import { Module } from '@nestjs/common';
import { LikedNodeService } from './application/liked-node.service';
import { LikedNodeController } from './presentation/liked-node.controller';

@Module({
    controllers: [LikedNodeController],
    providers: [LikedNodeService],
    exports: [LikedNodeService],
})
export class LikedNodeModule {}
