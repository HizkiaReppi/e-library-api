import { ApiProperty } from '@nestjs/swagger'
import {
  IsString,
  IsNotEmpty,
  IsStrongPassword,
  IsAlphanumeric,
  IsEmail,
} from 'class-validator'

export class CreateUserDto {
  @ApiProperty({
    type: String,
    example: 'John Doe',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({
    type: String,
    example: 'johndoe',
    required: true,
  })
  @IsString()
  @IsAlphanumeric()
  @IsNotEmpty()
  username: string

  @ApiProperty({
    type: String,
    example: 'johndoe@gmail.com',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string

  @ApiProperty({
    type: String,
    example: 'password',
    required: true,
  })
  @IsString()
  @IsStrongPassword(
    {
      minLength: 6,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        'Password must be strong and contain at least 6 characters, 1 lowercase, 1 uppercase, 1 number, and 1 symbol',
    },
  )
  @IsNotEmpty()
  password: string

  refreshToken: string

  lastLogin: Date
}

export class CreateUserResponseDto {
  @ApiProperty({ example: true, description: 'Status of the response' })
  status: boolean

  @ApiProperty({ example: 201, description: 'HTTP status code' })
  code: number

  @ApiProperty({
    example: 'Data has been created successfully',
    description: 'Message of the response',
  })
  message: string

  @ApiProperty({
    type: 'object',
    properties: {
      id: { type: 'string', example: '25e1693b-71a9-4a46-a52b-5f381e713753' },
      name: { type: 'string', example: 'John Doe' },
      username: { type: 'string', example: 'johndoe' },
      email: { type: 'string', example: 'johndoe@gmail.com' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
  })
  data: {
    id: string
    name: string
    username: string
    email: string
    createdAt: Date
    updatedAt: Date
  }
}
