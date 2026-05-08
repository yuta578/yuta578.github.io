import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Click } from './entities/click.entity';

@Injectable()
export class ClickService {
  constructor(
    @InjectRepository(Click)
    private clickRepo: Repository<Click>,
  ) {}

  async increment(): Promise<{ count: number }> {
    let row = await this.clickRepo.findOne({ where: { id: 1 } });

    if (!row) {
      row = this.clickRepo.create({ count: 1 });
    } else {
      row.count += 1;
    }

    await this.clickRepo.save(row);
    return { count: row.count };
  }

  async getCount(): Promise<{ count: number }> {
    const row = await this.clickRepo.findOne({ where: { id: 1 } });
    return { count: row?.count ?? 0 };
  }
}
