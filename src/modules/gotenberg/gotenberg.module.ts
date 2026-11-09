import { Module } from '@nestjs/common';
import { GotenbergService } from './application/gotenberg.service';
import { HttpInfrastructureModule } from '../../shared/infrastructure/http/http.module';

@Module({
    imports: [HttpInfrastructureModule],
    providers: [GotenbergService],
    exports: [GotenbergService],
})
export class GotenbergModule {}
