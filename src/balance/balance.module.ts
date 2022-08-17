import { Module } from '@nestjs/common';
import { BalanceService } from './balance.service';
import { BalanceController } from './balance.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Balance, balanceSchema } from './schemas/balance.schema';
import { Transaction, transactionSchema } from './schemas/transactons.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Balance.name, schema: balanceSchema },
      { name: Transaction.name, schema: transactionSchema },
    ]),
  ],
  controllers: [BalanceController],
  providers: [BalanceService],
})
export class BalanceModule {}
