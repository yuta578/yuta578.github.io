import { Controller, Post, Get } from '@nestjs/common';
import { ClickService } from './click.service';

@Controller('clicks')
export class ClickController {
  constructor(private readonly clickService: ClickService) {}

  @Post()
  increment() {
    return this.clickService.increment();
  }

  @Get()
  getCount() {
    return this.clickService.getCount();
  }
}
