import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { CreateUserDto } from '@/users/dto/create-user.dto'
import Response from '@/common/utils/Response'
import { Request } from 'express'
import { JwtAuthGuard } from '@/guards/jwt-auth.guard'
import { Public } from '@/decorator/public.decorator'
import { SignInDto } from './dto/sign-in.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @Public()
  async signUp(@Body() createUserDto: CreateUserDto) {
    const tokens = await this.authService.signUp(createUserDto)
    return Response.success({
      code: HttpStatus.CREATED,
      message: 'Register success',
      data: tokens,
    })
  }

  @Post('signin')
  @Public()
  async signIn(@Body() signInDto: SignInDto) {
    const tokens = await this.authService.signIn(signInDto)
    return Response.success({
      code: HttpStatus.OK,
      message: 'Login success',
      data: tokens,
    })
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: Request) {
    await this.authService.logout(req.user['sub'])
    return Response.noData({
      status: true,
      code: HttpStatus.NO_CONTENT,
      message: 'Logout success',
    })
  }
}
