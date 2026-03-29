import { Module } from '@nestjs/common';
import { EmplayersParserService } from './emplayees_parser.service';
import { EmplayersParserController } from './emplayees_parser.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
    controllers: [EmplayersParserController],
    providers: [EmplayersParserService],
    imports: [ConfigModule],
    exports: [EmplayersParserService],
})
export class EmplayersParserModule {}
