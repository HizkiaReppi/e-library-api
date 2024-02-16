import { Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { PrismaService } from '@/common/utils/prisma.service'
import { BcryptService } from '@/common/utils/bcrypt.service'

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService, BcryptService],
})
export class UsersModule {}
