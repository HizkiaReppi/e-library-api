import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { SignInDto } from './dto/sign-in.dto'
import { CreateUserDto } from '@/users/dto/create-user.dto'
import { UsersService } from '@/users/users.service'
import { BcryptService } from '@/common/utils/bcrypt.service'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private bcryptService: BcryptService,
    private configService: ConfigService,
  ) {}
  async signUp(createUserDto: CreateUserDto): Promise<any> {
    const usernameExists = await this.usersService.findByUsername(
      createUserDto.username,
    )
    if (usernameExists) throw new BadRequestException('Username already exists')

    const emailExists = await this.usersService.findByEmail(createUserDto.email)
    if (emailExists) throw new BadRequestException('Email already exists')

    const hashedPassword = await this.bcryptService.hashData(
      createUserDto.password,
    )

    const newUser = await this.usersService.create({
      ...createUserDto,
      password: hashedPassword,
    })

    const tokens = await this.getTokens(
      newUser.id,
      newUser.username,
      newUser.role,
    )
    await this.updateRefreshToken(newUser.id, tokens.refreshToken)

    return tokens
  }

  async signIn(data: SignInDto) {
    const user = await this.usersService.findByUsername(data.username)

    if (
      !user ||
      !(await this.bcryptService.compareData(data.password, user.password))
    ) {
      throw new BadRequestException('Username or password is incorrect')
    }

    const tokens = await this.getTokens(user.id, user.username, user.role)
    await this.updateRefreshToken(user.id, tokens.refreshToken)

    return tokens
  }

  async logout(userId: string) {
    return this.usersService.update(userId, { refreshToken: null })
  }

  private async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await this.bcryptService.hashData(refreshToken)
    await this.usersService.update(userId, {
      refreshToken: hashedRefreshToken,
    })
  }

  private async getTokens(userId: string, username: string, role: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
          role,
        },
        {
          secret: this.configService.get<string>('security.secret'),
          expiresIn: this.configService.get<string>('security.expiresIn'),
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
          role,
        },
        {
          secret: this.configService.get<string>('security.refreshSecret'),
          expiresIn: this.configService.get<string>('security.refreshIn'),
        },
      ),
    ])

    return {
      accessToken,
      refreshToken,
    }
  }
}
