import {
  SuccessResponse,
  ErrorResponse,
  Pagination,
  NoDataResponse,
} from './response.interface'

export default class Response {
  public static success({ code, message, data }: SuccessResponse) {
    return {
      status: true,
      code,
      message,
      data,
    }
  }

  public static error({ code, error, data }: ErrorResponse) {
    return {
      status: false,
      code,
      error,
      data,
    }
  }

  public static getDataWithPagination({
    code,
    message,
    data,
    totalData,
    totalPage,
    page,
    limit,
  }: Pagination) {
    return {
      status: false,
      code,
      message,
      data,
      meta: {
        totalData,
        totalPage,
        page,
        limit,
      },
    }
  }

  public static noData({ status, code, message }: NoDataResponse) {
    return {
      status,
      code,
      message,
    }
  }
}
