import * as fs from 'fs'
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { CreateBookDto } from './dto/create-book.dto'
import { UpdateBookDto } from './dto/update-book.dto'
import { PrismaService } from '@/common/utils/prisma.service'

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  async create(
    createBookDto: CreateBookDto,
    pdf?: Express.Multer.File,
    cover?: Express.Multer.File,
  ) {
    const isbn = createBookDto.isbn
    const isIsbnExist = await this.prisma.book.findUnique({ where: { isbn } })
    if (isIsbnExist) throw new ConflictException('Isbn already exist')

    createBookDto.publishedAt = +createBookDto.publishedAt
    createBookDto.totalBooks = +createBookDto.totalBooks

    const isCategoryExist = await this.prisma.category.findUnique({
      where: { id: createBookDto.categoryId },
    })
    if (!isCategoryExist) throw new NotFoundException('Category not found')

    const data = {
      ...createBookDto,
      file: pdf ? pdf[0].destination + pdf[0].filename : null,
      cover: cover ? cover[0].destination + cover[0].filename : null,
    }

    return this.prisma.book.create({
      data,
    })
  }

  async findAll(limit: number, page: number) {
    const skip = (page - 1) * limit
    const data = await this.prisma.book.findMany({
      skip,
      take: limit,
      orderBy: { title: 'asc' },
      select: {
        id: true,
        categoryId: true,
        isbn: true,
        title: true,
        author: true,
        createdAt: true,
        updatedAt: true,
      },
    })
    await this.checkData(data)

    return data
  }

  async findById(id: string) {
    const data = await this.prisma.book.findUnique({ where: { id } })
    await this.checkData(data)

    return data
  }

  async update(
    id: string,
    updateBookDto: UpdateBookDto,
    pdf?: Express.Multer.File,
    cover?: Express.Multer.File,
  ) {
    const data = await this.findById(id)
    await this.checkData(data)

    const updatedData = await this.prisma.book.update({
      where: { id },
      data: {
        ...updateBookDto,
        file: pdf ? pdf[0].destination + pdf[0].filename : data.file,
        cover: cover ? cover[0].destination + cover[0].filename : data.cover,
      },
    })

    if (pdf && pdf[0].destination + pdf[0].filename !== data.file) {
      fs.unlinkSync(data.file)
    }

    if (cover && cover[0].destination + cover[0].filename !== data.cover) {
      fs.unlinkSync(data.cover)
    }

    return updatedData
  }

  async remove(id: string) {
    const data = await this.findById(id)
    await this.checkData(data)

    const success = await this.prisma.book.delete({ where: { id } })

    if (success) {
      fs.unlinkSync(data.file)
      fs.unlinkSync(data.cover)
    }

    return success
  }

  async findManyByCategoryId(categoryId: string, limit: number, page: number) {
    const skip = (page - 1) * limit
    const data = await this.prisma.book.findMany({
      where: { categoryId },
      take: limit,
      skip,
    })
    await this.checkData(data)

    return data
  }

  async findByIsbn(isbn: string) {
    const data = await this.prisma.book.findUnique({ where: { isbn } })
    await this.checkData(data)

    return data
  }

  async getFile(id: string) {
    const file = await this.prisma.book.findUnique({
      where: { id },
      select: { file: true },
    })
    await this.checkData(file)

    return file
  }

  async countData() {
    return this.prisma.book.count()
  }

  async countDataByCategory(categoryId: string) {
    return this.prisma.book.count({ where: { categoryId } })
  }

  private async checkData(data: any) {
    if (!data) throw new NotFoundException('Data Book not found')
    return true
  }
}
