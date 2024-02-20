import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { PrismaService } from '@/common/utils/prisma.service'
import { BcryptService } from '@/common/utils/bcrypt.service'

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private bcryptService: BcryptService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const username = await this.findByUsername(createUserDto.username)
    if (username) throw new BadRequestException('Username already exists')

    const email = await this.findByEmail(createUserDto.email)
    if (email) throw new BadRequestException('Email already exists')

    const hashedPassword = await this.bcryptService.hashData(
      createUserDto.password,
    )

    return this.prisma.user.create({
      data: { ...createUserDto, password: hashedPassword },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true,
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
      where: { isActive: true },
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

  async findAllData(limit: number, page: number) {
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
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    })
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id, isActive: true },
    })
    await this.checkData(user)
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
    await this.findById(id)

    if (updateUserDto.password) {
      updateUserDto.password = await this.bcryptService.hashData(
        updateUserDto.password,
      )
    }

    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true,
        refreshToken: true,
        updatedAt: true,
      },
    })
  }

  async remove(id: string) {
    return this.prisma.user.delete({ where: { id } })
  }

  async activate(id: string) {
    await this.findById(id)

    return this.prisma.user.update({
      where: { id },
      data: { isActive: true },
      select: { id: true },
    })
  }

  async deactivate(id: string) {
    await this.findById(id)

    return this.prisma.user.update({
      where: { id },
      data: { isActive: false },
      select: { id: true },
    })
  }

  async countData(isActive?: boolean): Promise<number> {
    const where = isActive ? { isActive } : {}
    return this.prisma.user.count({ where })
  }

  private async checkData(data: any) {
    if (!data) throw new NotFoundException('Data not found')
    return true
  }
}
