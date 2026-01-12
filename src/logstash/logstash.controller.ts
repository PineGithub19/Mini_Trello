import { Controller } from '@nestjs/common';
import { LogstashService } from './logstash.service';

@Controller('logstash')
export class LogstashController {
  constructor(private readonly logstashService: LogstashService) {}
}
