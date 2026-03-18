import { ExceptionFilter, ArgumentsHost } from '@nestjs/common';
export interface ErrorResponseBody {
    success: false;
    message: string;
    code: number;
    path?: string;
}
export declare class GlobalHttpExceptionFilter implements ExceptionFilter {
    private readonly logger;
    catch(exception: unknown, host: ArgumentsHost): void;
    private normalize;
}
