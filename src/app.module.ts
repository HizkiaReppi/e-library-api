import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import config from './common/configs/config'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
