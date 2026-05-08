import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Click {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 0 })
  count: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
