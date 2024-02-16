import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { UsersModule } from './users/users.module'
import { AuthModule } from './auth/auth.module'
import config from './common/configs/config'
import { APP_GUARD } from '@nestjs/core'
import { JwtAuthGuard } from './guards/jwt-auth.guard'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
