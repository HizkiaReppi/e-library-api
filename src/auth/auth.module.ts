import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy'
import { AccessTokenStrategy } from './strategies/accessToken.strategy'
import { UsersModule } from '@/users/users.module'
import { PrismaService } from '@/common/utils/prisma.service'
import { UsersService } from '@/users/users.service'
import { BcryptService } from '@/common/utils/bcrypt.service'

@Module({
  imports: [UsersModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    PrismaService,
    BcryptService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
})
export class AuthModule {}
