import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/user/user.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Transaction {
  @ApiProperty({ example: 'a1b2c3d4-5678-90ef-ghij-klmnopqrstuv' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ type: () => User })
  @ManyToOne(() => User, user => user.transactions)
  user: User;

  @ApiProperty({ enum: ['FUND', 'CONVERT', 'TRADE'], example: 'FUND' })
  @Column()
  type: 'FUND' | 'CONVERT' | 'TRADE';

  @ApiProperty({ example: 'NGN', required: false })
  @Column({ nullable: true })
  fromCurrency?: string;

  @ApiProperty({ example: 'USD', required: false })
  @Column({ nullable: true })
  toCurrency?: string;

  @ApiProperty({ example: 1000.00 })
  @Column('decimal', { precision: 15, scale: 2 })
  amount: number;

  @ApiProperty({ example: 1200.123456 })
  @Column('decimal', { precision: 10, scale: 6 })
  rateUsed: number;

  @ApiProperty({ enum: ['PENDING', 'SUCCESS', 'FAILED'], example: 'SUCCESS' })
  @Column()
  status: 'PENDING' | 'SUCCESS' | 'FAILED';

  @ApiProperty({ example: new Date().toISOString() })
  @CreateDateColumn()
  createdAt: Date;
}
