import { IsString, IsNotEmpty, Length } from 'class-validator'

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 50)
  name: string

  @IsString()
  @Length(0, 191)
  description: string
}
