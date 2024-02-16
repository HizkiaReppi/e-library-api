import Response from '../common/utils/Response'
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common'
import { Response as ExpressResponse } from 'express'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<ExpressResponse>()
    const status = exception.getStatus()
    const exceptionResponse = exception.getResponse()

    const messages =
      typeof exceptionResponse === 'object' &&
      'message' in exceptionResponse &&
      Array.isArray(exceptionResponse.message)
        ? exceptionResponse.message
        : [exception.message]

    if (status === 400 && messages.length >= 1) {
      return response.status(status).send(
        Response.error({
          code: status,
          error: exception.message,
          data: messages,
        }),
      )
    }

    if (status === 401) {
      return response.status(status).send(
        Response.noData({
          status: false,
          code: status,
          message: exception.message,
        }),
      )
    }

    response.status(status).send(
      Response.error({
        code: status,
        error: exception.message,
        data: null,
      }),
    )
  }
}
