import { Injectable } from '@nestjs/common';
import { Scope } from './common/decorators';

@Injectable()
export class AppService {
  getHello() {
    return { hello: 'Hello World 12' };
  }
}
