import { Body, Controller, Post } from '@nestjs/common';
import { KafkaService } from './kafka.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { Public } from 'src/auth/decorators/is-public/is-public.decorator';

@Controller('kafka')
export class KafkaController {
  constructor(private readonly kafkaService: KafkaService) { }

  @Post('test')
  @Public()
  async testKafka(@Body() message: any) {
    message = { data: "Hello World" };
    return this.kafkaService.emitMessage('test-topic', message);
  }

  @EventPattern('test-topic')
  async handleEntityCreated(@Payload() message: any) {
    console.log('Kafka event received:', message);
  }

  @MessagePattern('test-topic') // For request-response if needed
  async handleMessage(@Payload() message: any) {
    console.log('Kafka message received:', message);
    return 'Message processed';
  }
}
