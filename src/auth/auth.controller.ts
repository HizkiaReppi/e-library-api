import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { CreateUserDto } from '@/users/dto/create-user.dto'
import Response from '@/common/utils/Response'
import { Request } from 'express'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() createUserDto: CreateUserDto) {
    const tokens = await this.authService.signUp(createUserDto)
    return Response.success({
      code: HttpStatus.CREATED,
      message: 'Register success',
      data: tokens,
    })
  }

  @Post('signin')
  async signIn(@Body() data: any) {
    const tokens = await this.authService.signIn(data)
    return Response.success({
      code: HttpStatus.OK,
      message: 'Login success',
      data: tokens,
    })
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Req() req: Request) {
    await this.authService.logout(req.user['sub'])
    return Response.noData({
      status: true,
      code: HttpStatus.NO_CONTENT,
      message: 'Logout success',
    })
  }
}
