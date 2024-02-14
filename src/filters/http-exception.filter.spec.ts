import {
  ArgumentsHost,
  BadRequestException,
  HttpException,
} from '@nestjs/common'
import { Response as ExpressResponse } from 'express'
import { HttpExceptionFilter } from './http-exception.filter'

describe('HttpExceptionFilter', () => {
  let filter: HttpExceptionFilter

  beforeEach(() => {
    filter = new HttpExceptionFilter()
  })

  it('should be defined', () => {
    expect(new HttpExceptionFilter()).toBeDefined()
  })

  it('should catch HttpException and send response with single message', () => {
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as any as ExpressResponse

    const exception = new HttpException('Test error message', 404)

    const host = {
      switchToHttp: () => ({
        getResponse: () => mockResponse,
      }),
    } as ArgumentsHost

    filter.catch(exception, host)

    expect(mockResponse.status).toHaveBeenCalledWith(404)
    expect(mockResponse.send).toHaveBeenCalledWith({
      status: false,
      code: 404,
      error: 'Test error message',
      data: null,
    })
  })

  it('should catch BadRequestException and send response with multiple messages', () => {
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as any as ExpressResponse

    const exception = new BadRequestException({
      message: ['Error message 1', 'Error message 2'],
    })

    const host = {
      switchToHttp: () => ({
        getResponse: () => mockResponse,
      }),
    } as ArgumentsHost

    filter.catch(exception, host)

    expect(mockResponse.status).toHaveBeenCalledWith(400)
    expect(mockResponse.send).toHaveBeenCalledWith({
      status: false,
      code: 400,
      error: 'Bad Request Exception',
      data: ['Error message 1', 'Error message 2'],
    })
  })

  it('should catch BadRequestException and send response with single messages', () => {
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as any as ExpressResponse

    const exception = new BadRequestException({
      message: ['Error message 1'],
    })

    const host = {
      switchToHttp: () => ({
        getResponse: () => mockResponse,
      }),
    } as ArgumentsHost

    filter.catch(exception, host)

    expect(mockResponse.status).toHaveBeenCalledWith(400)
    expect(mockResponse.send).toHaveBeenCalledWith({
      status: false,
      code: 400,
      error: 'Bad Request Exception',
      data: ['Error message 1'],
    })
  })
})
