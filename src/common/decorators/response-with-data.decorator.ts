import { applyDecorators, Type } from '@nestjs/common';
import {
    ApiExtraModels,
    ApiResponse,
    getSchemaPath,
} from '@nestjs/swagger';

export const ApiResponseWithData = <TModel extends Type<any>>(
    model: TModel | [TModel],
    options?: {
        status?: number;
        description?: string;
    },
) => {
    const status = options?.status ?? 200;

    if (Array.isArray(model)) {
        return applyDecorators(
            ApiExtraModels(model[0]),
            ApiResponse({
                status,
                description: options?.description ?? 'Success',
                schema: {
                    properties: {
                        success: { type: 'boolean', example: true },
                        message: { type: 'string', example: 'Success' },
                        statusCode: { type: 'number', example: status },
                        data: {
                            type: 'array',
                            items: { $ref: getSchemaPath(model[0]) },
                        },
                    },
                },
            }),
        );
    }

    return applyDecorators(
        ApiExtraModels(model),
        ApiResponse({
            status,
            description: options?.description ?? 'Success',
            schema: {
                properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Success' },
                    statusCode: { type: 'number', example: status },
                    data: { $ref: getSchemaPath(model) },
                },
            },
        }),
    );
};
