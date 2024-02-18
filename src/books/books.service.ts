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

  async create(createBookDto: CreateBookDto) {
    const isbn = createBookDto.isbn
    const isIsbnExist = await this.prisma.book.findUnique({ where: { isbn } })
    if (isIsbnExist) throw new ConflictException('Isbn already exist')

    const isCategoryExist = await this.prisma.category.findUnique({
      where: { id: createBookDto.categoryId },
    })
    if (!isCategoryExist) throw new NotFoundException('Category not found')

    return this.prisma.book.create({
      data: createBookDto,
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

  async update(id: string, updateBookDto: UpdateBookDto) {
    const data = await this.findById(id)
    await this.checkData(data)

    return this.prisma.book.update({
      where: { id },
      data: updateBookDto,
    })
  }

  async remove(id: string) {
    const data = await this.findById(id)
    await this.checkData(data)

    return this.prisma.book.delete({ where: { id } })
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