import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('notifications')
  getNotifications(
    @Payload() data: Record<string, unknown>,
    @Ctx() context: RmqContext,
  ) {
    console.log(data);
    console.log(`Pattern: ${context.getPattern()}`);
  }

  getHello(): string {
    return this.appService.getHello();
  }
}
