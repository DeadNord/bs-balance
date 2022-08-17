import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { log } from 'console';
import { Model } from 'mongoose';
import { CreateC2CTransDto } from './dto/create-c2c-trans.dto copy';
import { CreateTransDto } from './dto/create-trans.dto';
import { PaginateDto } from './dto/paginate.dto';
import { getCoursesService } from './helpers/getCoursesService';
import { Balance, balanceDocument } from './schemas/balance.schema';
import { Transaction, transactionDocument } from './schemas/transactons.schema';

@Injectable()
export class BalanceService {
  constructor(
    @InjectModel(Balance.name)
    private balanceModel: Model<balanceDocument>,
    @InjectModel(Transaction.name)
    private transactionModel: Model<transactionDocument>,
  ) {}

  async createTrans(createTransDto: CreateTransDto) {
    const user = await this.balanceModel.findOne({ id: createTransDto.id });

    if (!user) {
      if (createTransDto.sum <= 0) {
        throw new BadRequestException(`Insufficient funds on the account`);
      }
      await this.balanceModel.create({
        id: createTransDto.id,
        balance: createTransDto.sum,
      });

      await this.transactionModel.create({
        from: 'System',
        to: createTransDto.id,
        value: createTransDto.sum,
        balance: createTransDto.sum,
        date: new Date(),
        comment:
          createTransDto.comment === ''
            ? createTransDto.sum < 0
              ? 'Outcome'
              : 'Income'
            : createTransDto.comment,
      });
      return;
    }

    if (user.balance + createTransDto.sum < 0) {
      throw new BadRequestException(`Insufficient funds on the account`);
    }

    await this.balanceModel.findOneAndUpdate(
      { id: createTransDto.id },
      {
        balance: user.balance + createTransDto.sum,
      },
    );
    await this.transactionModel.create({
      from: 'System',
      to: createTransDto.id,
      value: createTransDto.sum,
      balance: user.balance + createTransDto.sum,
      date: new Date(),
      comment:
        createTransDto.comment === ''
          ? createTransDto.sum < 0
            ? 'Outcome'
            : 'Income'
          : createTransDto.comment,
    });

    return;
  }

  async createC2CTrans(createC2CTransDto: CreateC2CTransDto) {
    // const userFrom = await this.balanceModel.findOne({
    //   id: createC2CTransDto.from,
    // });

    // if (!userFrom) {
    //   throw new BadRequestException(`Invalid sender name`);
    // }

    // console.log('YY');

    const user = await this.balanceModel.findOne({ id: createC2CTransDto.id });

    if (!user) {
      // console.log('YY');
      if (createC2CTransDto.sum < 0) {
        throw new BadRequestException(`Insufficient funds on the account`);
      }
      await this.balanceModel.create({
        id: createC2CTransDto.id,
        balance: createC2CTransDto.sum,
      });

      await this.transactionModel.create({
        from: createC2CTransDto.from,
        to: createC2CTransDto.id,
        value: createC2CTransDto.sum,
        balance: createC2CTransDto.sum,
        date: new Date(),
        comment:
          createC2CTransDto.comment === ''
            ? createC2CTransDto.sum < 0
              ? 'Outcome'
              : 'Income'
            : createC2CTransDto.comment,
      });

      return;
    }

    if (user.balance + createC2CTransDto.sum < 0) {
      throw new BadRequestException(`Insufficient funds on the account`);
    }

    await this.balanceModel.findOneAndUpdate(
      { id: createC2CTransDto.id },
      {
        balance: user.balance + createC2CTransDto.sum,
      },
    );
    // console.log(createC2CTransDto.from);

    await this.transactionModel.create({
      from: createC2CTransDto.from,
      to: createC2CTransDto.id,
      value: createC2CTransDto.sum,
      balance: user.balance + createC2CTransDto.sum,
      date: new Date(),
      comment:
        createC2CTransDto.comment === ''
          ? createC2CTransDto.sum < 0
            ? 'Outcome'
            : 'Income'
          : createC2CTransDto.comment,
    });

    return;
  }

  async getBalance(id: string, currency: string) {
    const user = await this.balanceModel.findOne({ id });
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }

    if (currency !== undefined) {
      const res = await getCoursesService('USD', currency);
      if (res === 'ERR_BAD_REQUEST') {
        throw new BadRequestException(`Currency ${currency} not found`);
      }

      const courses = res.exchange_rates[currency];

      const balance = user.balance * courses;

      return {
        balance: balance,
        currency: currency,
      };
    }

    return {
      balance: user.balance,
      currency: 'USD',
    };
  }

  async getTrans(id: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const transactions = await this.transactionModel
      .find(
        {
          id,
        },
        // { $match: 'transactions' },
        '',
        {
          skip,
          limit: +limit,
        },
      )
      .sort({ date: -1, value: -1 });

    return transactions;
  }
}
