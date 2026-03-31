import { Module } from '@nestjs/common';
import { PoliticService } from './politic.service';
import { PoliticController } from './politic.controller';
import { EmplayersParserModule } from '../emplayees_parser/emplayees_parser.module';

@Module({
    imports: [EmplayersParserModule],
    controllers: [PoliticController],
    providers: [PoliticService],
    exports: [PoliticService],
})
export class PoliticModule {}
