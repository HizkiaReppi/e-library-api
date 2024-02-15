import {
  IsString,
  IsNotEmpty,
  IsStrongPassword,
  IsAlphanumeric,
  IsEmail,
} from 'class-validator'

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsAlphanumeric()
  @IsNotEmpty()
  username: string

  @IsEmail()
  @IsNotEmpty()
  email: string

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
}
