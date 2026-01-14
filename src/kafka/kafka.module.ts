import { Module } from '@nestjs/common';
import { KafkaService } from './kafka.service';
import { KafkaController } from './kafka.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_CLIENT',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'minitrello-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [KafkaController],
  providers: [KafkaService],
  exports: [ClientsModule, KafkaService],
})
export class KafkaModule { }
