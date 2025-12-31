import { applyDecorators, Type } from '@nestjs/common';
import {
    ApiExtraModels,
    ApiResponse,
    getSchemaPath,
} from '@nestjs/swagger';

export const ApiResponseWithData = <TModel extends Type<any>>(
    model: TModel,
    options?: {
        status?: number;
        description?: string;
    },
) => {
    const status = options?.status ?? 200;

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
