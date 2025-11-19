import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { HttpArgumentsHost } from "@nestjs/common/interfaces";
import { Request, Response } from "express";

@Catch()
export class DatabaseExceptionFilter implements ExceptionFilter {
  private readonly logger: Logger = new Logger("ExceptionsHandler");

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const response: Response = ctx.getResponse<Response>();
    const request: Request = ctx.getRequest<Request>();

    let status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | object = "Internal server error";

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const responseBody: string | object = exception.getResponse();

      if (typeof responseBody === "object" && responseBody !== null) {
        const { statusCode: _statusCode, ...rest } = responseBody as Record<
          string,
          any
        >;
        message = rest;
      } else {
        message = responseBody;
      }
    } else if (exception instanceof Error) {
      const cause: unknown = exception.cause;
      if (cause instanceof Error && this.isDatabaseConnectionError(cause)) {
        status = HttpStatus.SERVICE_UNAVAILABLE;
        message = "Database connection failed";
      } else if (this.isDatabaseOperationError(exception)) {
        status = HttpStatus.BAD_REQUEST;
        message = "Database operation failed";
      } else {
        message = "An unexpected error occurred";
      }
    } else {
      message = "An unexpected error occurred";
    }

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    };

    if (exception instanceof Error && !(exception instanceof HttpException)) {
      this.logger.error(exception);
    }

    return response.status(status).json(errorResponse);
  }

  private isDatabaseConnectionError(error: Error): boolean {
    const connectionPatterns: RegExp[] = [
      /ECONNREFUSED/i,
      /connection refused/i,
      /connection timeout/i,
      /ETIMEDOUT/i,
      /ENOTFOUND/i,
      /connection failed/i,
      /could not connect/i,
      /connection terminated/i,
    ];

    const errorText: string = `${error.message} ${error.name} ${error.stack || ""}`;
    return connectionPatterns.some((pattern) => pattern.test(errorText));
  }

  private isDatabaseOperationError(error: Error): boolean {
    const dbPatterns: RegExp[] = [
      /database/i,
      /query/i,
      /postgres/i,
      /constraint/i,
      /relation.*does not exist/i,
      /column.*does not exist/i,
    ];

    const errorText: string = `${error.message} ${error.name}`;
    return dbPatterns.some((pattern) => pattern.test(errorText));
  }
}
