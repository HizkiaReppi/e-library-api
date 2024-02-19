export interface SuccessResponse {
  code: number
  data: any
  message: string
}

export interface ErrorResponse {
  code: number
  data: any
  error: string
}

export interface Pagination {
  code: number
  data: any
  message: string
  totalData: number
  totalPage: number
  page: number
  limit: number
}

export interface NoDataResponse {
  status: boolean
  code: number
  message: string
}
