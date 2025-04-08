

import { DataSource } from 'typeorm';
import { Wallet } from './wallet.entity';

export const walletProviders = [
  {
    provide: 'WALLET_REPO',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Wallet),
    inject: ['DATA_SOURCE'],
  },
];