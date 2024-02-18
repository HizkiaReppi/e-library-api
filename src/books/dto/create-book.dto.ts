import { IsNotEmpty, IsString, IsInt, Min, Max, Length } from 'class-validator'

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  isbn: string

  @IsNotEmpty()
  @IsString()
  categoryId: string

  @IsString()
  @IsNotEmpty()
  @Length(3, 191)
  title: string

  @IsString()
  @IsNotEmpty()
  @Length(3, 191)
  author: string

  @IsString()
  @IsNotEmpty()
  @Length(3, 191)
  publisher: string

  @IsInt()
  @Min(1)
  @Max(new Date().getFullYear())
  publishedAt: number

  @IsInt()
  @Min(1)
  @Max(999)
  totalBooks: number

  @IsString()
  @Length(0, 191)
  description: string

  @IsString()
  @Length(0, 191)
  cover: string

  @IsString()
  @Length(0, 191)
  file: string
}
