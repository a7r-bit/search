import { Module } from '@nestjs/common';
import { GotenbergService } from './gotenberg.service';
import { HttpInfrastructureModule } from '../../infrastructure/http/http.module';

@Module({
    imports: [HttpInfrastructureModule],
    providers: [GotenbergService],
    exports: [GotenbergService],
})
export class GotenbergModule {}
