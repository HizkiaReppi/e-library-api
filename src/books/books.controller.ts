import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  Res,
} from '@nestjs/common'
import { Response as ExpressResponse } from 'express'
import { BooksService } from './books.service'
import { CreateBookDto } from './dto/create-book.dto'
import { UpdateBookDto } from './dto/update-book.dto'
import Response from '@/common/utils/Response'

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  async create(
    @Body() createBookDto: CreateBookDto,
    @Res() res: ExpressResponse,
  ) {
    const data = await this.booksService.create(createBookDto)

    res.location(`/books/${data.id}`).send(
      Response.success({
        code: 201,
        message: 'Book has been created successfully',
        data,
      }),
    )
  }

  @Get()
  async findAll(@Query('limit') limit?: number, @Query('page') page?: number) {
    limit = limit ? +limit : 10
    page = page ? +page : 1

    const data = await this.booksService.findAll(limit, page)
    const totalData = await this.booksService.countData()

    return Response.getDataWithPagination({
      code: 200,
      message: 'Book has been retrieved successfully',
      data,
      totalData,
      totalPage: Math.ceil(totalData / limit),
      limit,
      page,
    })
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.booksService.findById(id)

    return Response.success({
      code: 201,
      message: 'Book has been retrieved successfully',
      data,
    })
  }

  @Get('isbn/:isbn')
  async findIsbn(@Param('isbn') isbn: string) {
    const data = await this.booksService.findByIsbn(isbn)

    return Response.success({
      code: 201,
      message: 'Book has been retrieved successfully',
      data,
    })
  }

  @Get('category/:categoryId')
  async findManyByCategoryId(
    @Param('categoryId') categoryId: string,
    @Query('limit') limit?: number,
    @Query('page') page?: number,
  ) {
    limit = limit ? +limit : 10
    page = page ? +page : 1

    const data = await this.booksService.findManyByCategoryId(
      categoryId,
      limit,
      page,
    )
    const totalData = await this.booksService.countDataByCategory(categoryId)

    return Response.getDataWithPagination({
      code: 201,
      message: 'Book has been retrieved successfully',
      data,
      totalData: totalData,
      totalPage: Math.ceil(totalData / limit),
      limit,
      page,
    })
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    const data = await this.booksService.update(id, updateBookDto)

    return Response.success({
      code: 201,
      message: 'Book has been updated successfully',
      data,
    })
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    return this.booksService.remove(id)
  }
}
