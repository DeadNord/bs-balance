import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateC2CTransDto } from './dto/create-c2c-trans.dto';
import { CreateTransDto } from './dto/create-trans.dto';
import { CurrencyDto } from './dto/currency.dto';
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
        from: 'BeSocial',
        to: createTransDto.id,
        value: createTransDto.sum,
        balance: createTransDto.sum,
        date: new Date(),
        comment:
          createTransDto.sum < 0
            ? `Outcome on a BeSocial in sum ${createTransDto.sum}`
            : `Income from a BeSocial in sum ${createTransDto.sum}`,
        // createTransDto.comment === '' || createTransDto.comment === undefined
        //   ? createTransDto.sum < 0
        //     ? `Outcome on a BeSocial in sum ${createTransDto.sum}`
        //     : `Income from a BeSocial in sum ${createTransDto.sum}`
        //   : createTransDto.comment,
      });
      return {
        from: 'BeSocial',
        to: createTransDto.id,
        value: createTransDto.sum,
      };
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
      from: 'BeSocial',
      to: createTransDto.id,
      value: createTransDto.sum,
      balance: user.balance + createTransDto.sum,
      date: new Date(),
      comment:
        createTransDto.sum < 0
          ? `Outcome on a BeSocial in sum ${createTransDto.sum}`
          : `Income from a BeSocial in sum ${createTransDto.sum}`,
      // createTransDto.comment === '' || createTransDto.comment === undefined
      //   ? createTransDto.sum < 0
      //     ? `Outcome on a BeSocial in sum ${createTransDto.sum}`
      //     : `Income from a BeSocial in sum ${createTransDto.sum}`
      //   : createTransDto.comment,
    });

    return {
      from: 'BeSocial',
      to: createTransDto.id,
      value: createTransDto.sum,
    };
  }

  async createC2CTrans(createC2CTransDto: CreateC2CTransDto) {
    // const userFrom = await this.balanceModel.findOne({
    //   id: createC2CTransDto.from,
    // });

    // if (!userFrom) {
    //   throw new BadRequestException(`Invalid sender name`);
    // }

    const user = await this.balanceModel.findOne({ id: createC2CTransDto.id });

    if (!user) {
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
          createC2CTransDto.sum < 0
            ? `Outcome on a ${createC2CTransDto.from} in sum ${createC2CTransDto.sum}`
            : `Income from a ${createC2CTransDto.from} in sum ${createC2CTransDto.sum}`,
        // createC2CTransDto.comment === '' ||
        // createC2CTransDto.comment === undefined
        //   ? createC2CTransDto.sum < 0
        //     ? `Outcome on a ${createC2CTransDto.from} in sum ${createC2CTransDto.sum}`
        //     : `Income from a ${createC2CTransDto.from} in sum ${createC2CTransDto.sum}`
        //   : createC2CTransDto.comment,
      });

      return {
        from: createC2CTransDto.from,
        to: createC2CTransDto.id,
        value: createC2CTransDto.sum,
      };
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

    await this.transactionModel.create({
      from: createC2CTransDto.from,
      to: createC2CTransDto.id,
      value: createC2CTransDto.sum,
      balance: user.balance + createC2CTransDto.sum,
      date: new Date(),
      comment:
        createC2CTransDto.sum < 0
          ? `Outcome on a ${createC2CTransDto.from} in sum ${createC2CTransDto.sum}`
          : `Income from a ${createC2CTransDto.from} in sum ${createC2CTransDto.sum}`,
      // createC2CTransDto.comment === '' ||
      // createC2CTransDto.comment === undefined
      //   ? createC2CTransDto.sum < 0
      //     ? `Outcome on a ${createC2CTransDto.from} in sum ${createC2CTransDto.sum}`
      //     : `Income from a ${createC2CTransDto.from} in sum ${createC2CTransDto.sum}`
      //   : createC2CTransDto.comment,
    });

    return {
      from: createC2CTransDto.from,
      to: createC2CTransDto.id,
      value: createC2CTransDto.sum,
    };
  }

  async getBalance(id: string, currencyDto: CurrencyDto) {
    const user = await this.balanceModel.findOne({ id });
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }

    if (currencyDto !== undefined) {
      const res = await getCoursesService('USD', currencyDto);
      if (res === 'ERR_BAD_REQUEST') {
        throw new BadRequestException(`Currency ${currencyDto} not found`);
      }

      const courses = res.exchange_rates[String(currencyDto)];
      const exchange = user.balance * courses;

      return {
        balance: exchange,
        currency: String(currencyDto),
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
