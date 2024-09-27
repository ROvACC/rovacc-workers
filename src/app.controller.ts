import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern({ event: 'user_created' })
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
