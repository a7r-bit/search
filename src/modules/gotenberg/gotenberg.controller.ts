import { Controller } from '@nestjs/common';
import { GotenbergService } from './gotenberg.service';

@Controller('gotenberg')
export class GotenbergController {
  constructor(private readonly gotenbergService: GotenbergService) { }

}
