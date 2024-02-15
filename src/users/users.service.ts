import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { PrismaService } from '@/common/utils/prisma.service'

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const username = await this.findByUsername(createUserDto.username)
    if (username) throw new BadRequestException('Username already exists')

    const email = await this.findByEmail(createUserDto.email)
    if (email) throw new BadRequestException('Email already exists')

    return this.prisma.user.create({
      data: createUserDto,
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        refreshToken: true,
        createdAt: true,
      },
    })
  }

  async findAll(limit: number, page: number) {
    const skip = (page - 1) * limit
    return this.prisma.user.findMany({
      take: limit,
      skip,
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    })
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } })
    return user
  }

  async findByUsername(username: string) {
    const user = await this.prisma.user.findUnique({ where: { username } })
    return user
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } })
    return user
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const data = await this.findById(id)
    await this.checkData(data)

    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        refreshToken: true,
        updatedAt: true,
      },
    })
  }

  async remove(id: string) {
    const data = await this.findById(id)
    await this.checkData(data)

    return this.prisma.user.delete({ where: { id } })
  }

  async activate(id: string) {
    const data = await this.findById(id)
    await this.checkData(data)

    return this.prisma.user.update({
      where: { id },
      data: { isActive: true },
      select: { id: true },
    })
  }

  async deactivate(id: string) {
    const data = await this.findById(id)
    await this.checkData(data)

    return this.prisma.user.update({
      where: { id },
      data: { isActive: false },
      select: { id: true },
    })
  }

  async countData(): Promise<number> {
    return this.prisma.user.count()
  }

  private async checkData(data: any) {
    if (!data) throw new NotFoundException('Data not found')
    return true
  }
}
