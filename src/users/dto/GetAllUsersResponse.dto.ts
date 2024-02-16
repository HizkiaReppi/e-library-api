import { ApiProperty } from '@nestjs/swagger'

class UserDto {
  @ApiProperty({
    type: String,
    example: '25e1693b-71a9-4a46-a52b-5f381e713753',
  })
  id: string

  @ApiProperty({ type: String, example: 'John Doe' })
  name: string

  @ApiProperty({ type: String, example: 'johndoe' })
  username: string

  @ApiProperty({ type: String, example: 'johndoe@gmail.com' })
  email: string

  @ApiProperty({
    type: String,
    format: 'date-time',
  })
  createdAt: string

  @ApiProperty({
    type: String,
    format: 'date-time',
  })
  updatedAt: string
}

export class GetAllUsersResponseDto {
  @ApiProperty({ type: Boolean, example: true })
  status: boolean

  @ApiProperty({ type: Number, example: 200 })
  code: number

  @ApiProperty({
    type: String,
    example: 'Data has been retrieved successfully',
  })
  message: string

  @ApiProperty({ type: [UserDto] })
  data: UserDto[]

  @ApiProperty({
    type: 'object',
    description: 'Metadata about pagination',
    properties: {
      totalData: { type: 'number', example: 1 },
      totalPage: { type: 'number', example: 1 },
      page: { type: 'number', example: 1 },
      limit: { type: 'number', example: 10 },
    },
  })
  meta: {
    totalData: number
    totalPage: number
    page: number
    limit: number
  }
}
