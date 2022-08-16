import { Module } from '@nestjs/common';
import { BalanceService } from './balance.service';
import { BalanceController } from './balance.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Balance, balanceSchema } from './schemas/balance.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Balance.name, schema: balanceSchema }]),
  ],
  controllers: [BalanceController],
  providers: [BalanceService],
})
export class BalanceModule {}
