import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as bcrypt from 'bcrypt'

@Injectable()
export class BcryptService {
  constructor(private configService: ConfigService) {}

  async hashData(data: string) {
    return bcrypt.hash(
      data,
      this.configService.get('security.bcryptSaltOrRound'),
    )
  }

  async compareData(data: string, encrypted: string) {
    return bcrypt.compare(data, encrypted)
  }
}
