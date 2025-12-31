import { HttpException } from "@nestjs/common"

export class WorkspaceException extends HttpException {
    constructor(
        message: string,
        statusCode = 400,
        data: any = null
    ) {
        super({
            success: false,
            message,
            statusCode,
            data
        }, statusCode);
    }
}