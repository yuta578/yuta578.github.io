import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Click } from './entities/click.entity';
import { ClickService } from './click.service';
import { ClickController } from './click.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Click])],
  providers: [ClickService],
  controllers: [ClickController],
})
export class ClickModule {}
