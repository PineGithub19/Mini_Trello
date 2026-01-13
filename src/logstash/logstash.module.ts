import { Module } from '@nestjs/common';
import { LogstashService } from './logstash.service';
import { LogstashController } from './logstash.controller';

@Module({
  controllers: [LogstashController],
  providers: [LogstashService],
  exports: [LogstashService],
})
export class LogstashModule { }
