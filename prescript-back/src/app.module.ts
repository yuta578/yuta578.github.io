import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClickModule } from './modules/clicks-test/click.module';
import { DbModule } from './database/database.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DbModule,
    ClickModule,
  ],
})
export class AppModule {}