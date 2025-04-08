import { DataSource } from 'typeorm';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'postgres', // or another database type
        host: 'localhost',
        port: 3306,
        username: 'postgres',
        password: 'Iyanda',
        database: 'fx-tranding-app',
        //  entities: [User, Wallet, Transaction, OTP], // Add User entity here
        synchronize: true, // For dev only, don't use in production
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      });

      return dataSource.initialize();
    },
  },
];
