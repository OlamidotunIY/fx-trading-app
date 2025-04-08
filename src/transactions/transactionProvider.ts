import { DataSource } from 'typeorm';
import { Transaction } from './transaction.entity';

export const transactionProviders = [
  {
    provide: 'TS_REPO',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Transaction),
    inject: ['DATA_SOURCE'],
  },
];