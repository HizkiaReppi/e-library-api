import { IsNotEmpty, IsString, Length } from 'class-validator'

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

  publishedAt: number

  totalBooks: number

  @IsString()
  @Length(0, 191)
  description: string

  cover: string

  file: string
}
