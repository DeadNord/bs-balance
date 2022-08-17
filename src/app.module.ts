import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';

import { BalanceModule } from './balance/balance.module';

import 'dotenv/config';
const DB_HOST = process.env.DB_HOST;

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async () => ({
        uri: DB_HOST,
      }),
    }),
    BalanceModule,
  ],
})
export class AppModule {}
