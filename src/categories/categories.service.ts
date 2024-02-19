import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'
import { PrismaService } from '@/common/utils/prisma.service'

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const isNameExist = await this.findByName(createCategoryDto.name)
    if (isNameExist) {
      throw new ConflictException('Category name already exists')
    }

    return this.prisma.category.create({ data: createCategoryDto })
  }

  async findAll(limit: number, page: number) {
    const skip = (page - 1) * limit
    const data = await this.prisma.category.findMany({
      take: limit,
      skip,
      orderBy: { name: 'asc' },
    })
    await this.checkData(data)

    return data
  }

  async findById(id: string) {
    const data = await this.prisma.category.findUnique({ where: { id } })
    await this.checkData(data)

    return data
  }

  private async findByName(name: string) {
    return this.prisma.category.findUnique({ where: { name } })
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const data = await this.findById(id)
    await this.checkData(data)

    return this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
    })
  }

  async remove(id: string) {
    const data = await this.findById(id)
    await this.checkData(data)

    return this.prisma.category.delete({ where: { id } })
  }

  async countData() {
    return this.prisma.category.count()
  }

  private async checkData(data: any) {
    if (!data) throw new NotFoundException('Data Category not found')
    return true
  }
}
