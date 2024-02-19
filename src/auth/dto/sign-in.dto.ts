import { ApiProperty } from '@nestjs/swagger'

export class SignInDto {
  @ApiProperty({
    type: String,
    example: 'johndoe',
    required: true,
  })
  username: string

  @ApiProperty({
    type: String,
    example: 'password',
    required: true,
  })
  password: string
}
