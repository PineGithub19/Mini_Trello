import { Inject, Injectable } from '@nestjs/common';
import { Client } from '@elastic/elasticsearch';
import { Workspace } from '../workspaces/entities/workspace.entity';

@Injectable()
export class SearchService {
    private readonly index = 'workspaces';

    constructor(@Inject('ELASTICSEARCH_CLIENT') private readonly elasticsearchClient: Client) { }

    async indexWorkspace(workspace: Workspace) {
        return this.elasticsearchClient.index({
            index: this.index,
            id: workspace.id,
            document: {
                id: workspace.id,
                name: workspace.name,
                // description: workspace.description,
                ownerId: workspace.ownerId,
                createdAt: workspace.createdAt,
            },
        });
    }

    async search(text: string) {
        const result = await this.elasticsearchClient.search({
            index: this.index,
            query: {
                multi_match: {
                    query: text,
                    fields: ['name'],
                },
            },
        });

        return result.hits.hits.map((hit) => hit._source);
    }

    async remove(workspaceId: string) {
        return this.elasticsearchClient.delete({
            index: this.index,
            id: workspaceId,
        });
    }
}
