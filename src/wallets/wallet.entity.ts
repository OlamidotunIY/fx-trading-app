import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/user/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { SupportedCurrency } from './currency.enum';

@Entity()
export class Wallet {
  @ApiProperty({
    description: 'Unique wallet ID',
    example: 'f3b6c4c2-1211-43e4-86ab-5e26a0e731cd',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ type: () => User }) // Or just `string` if you're only returning the user ID
  @ManyToOne(() => User, (user) => user.wallets)
  user: User;

  @ApiProperty({ enum: SupportedCurrency, enumName: 'SupportedCurrency' })
  @Column({ type: 'enum', enum: SupportedCurrency })
  currency: SupportedCurrency;

  @ApiProperty({ description: 'Wallet balance', example: 1000.0 })
  @Column('float', { default: 0 }) // Use float for more flexible decimal precision
  balance: number;
}
