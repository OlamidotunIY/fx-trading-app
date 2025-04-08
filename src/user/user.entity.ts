import { ApiProperty } from '@nestjs/swagger';
import { Transaction } from 'src/transactions/transaction.entity';
import { Wallet } from 'src/wallets/wallet.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @ApiProperty({ example: '9f6a9b6b-0db0-4412-b1fd-9a14dcfdad24' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'user@example.com' })
  @Column({ unique: true })
  email: string;

  @ApiProperty({ example: 'John Doe' })
  @Column()
  name: string;

  @ApiProperty({ example: 'hashedpassword123' })
  @Column()
  password: string;

  @ApiProperty({ example: true, description: 'Indicates if the user has verified their email' })
  @Column({ default: false })
  isVerified: boolean;

  @ApiProperty({ type: () => [Wallet] })
  @OneToMany(() => Wallet, wallet => wallet.user)
  wallets: Wallet[];

  @ApiProperty({ type: () => [Transaction] })
  @OneToMany(() => Transaction, tx => tx.user)
  transactions: Transaction[];
}
