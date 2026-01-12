import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { Client } from '@elastic/elasticsearch';

@Module({
  controllers: [SearchController],
  providers: [
    SearchService,
    {
      provide: 'ELASTICSEARCH_CLIENT',
      useFactory: () => {
        return new Client({
          node: process.env.ELASTICSEARCH_NODE || 'http://localhost:9200',
        });
      },
    }
  ],
  exports: [SearchService]
})
export class SearchModule { }
