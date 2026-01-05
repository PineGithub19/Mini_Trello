import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { PageDto } from '../dto/page.dto';

export const ApiPaginatedResponse = <TModel extends Type<any>>(
    model: TModel,
    options?: {
        status?: number;
        description?: string;
    },
) => {
    const status = options?.status ?? 200;
    const description = options?.description ?? 'Successfully received model list';

    return applyDecorators(
        ApiExtraModels(PageDto, model),
        ApiOkResponse({
            description: description,
            schema: {
                properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Success' },
                    statusCode: { type: 'number', example: status },
                    data: {
                        allOf: [
                            { $ref: getSchemaPath(PageDto) },
                            {
                                properties: {
                                    items: {
                                        type: 'array',
                                        items: { $ref: getSchemaPath(model) },
                                    },
                                },
                            },
                        ],
                    },
                },
            },
        }),
    );
};
