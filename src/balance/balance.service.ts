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
import { getCoursesService } from './helpers/getCoursesService';
import { Balance, balanceDocument } from './schemas/balance.schema';

@Injectable()
export class BalanceService {
  constructor(
    @InjectModel(Balance.name)
    private balanceModel: Model<balanceDocument>,
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
        transactions: [
          {
            from: 'System',
            to: createTransDto.id,
            value: createTransDto.sum,
            date: new Date(),
            comment:
              createTransDto.comment === ''
                ? createTransDto.sum < 0
                  ? 'Outcome'
                  : 'Income'
                : createTransDto.comment,
          },
        ],
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
        $push: {
          transactions: [
            {
              from: 'System',
              to: createTransDto.id,
              value: createTransDto.sum,
              date: new Date(),
              comment:
                createTransDto.comment === ''
                  ? createTransDto.sum < 0
                    ? 'Outcome'
                    : 'Income'
                  : createTransDto.comment,
            },
          ],
        },
      },
    );

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
        transactions: [
          {
            from: createC2CTransDto.from,
            to: createC2CTransDto.id,
            value: createC2CTransDto.sum,
            date: new Date(),
            comment:
              createC2CTransDto.comment === ''
                ? createC2CTransDto.sum < 0
                  ? 'Outcome'
                  : 'Income'
                : createC2CTransDto.comment,
          },
        ],
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
        $push: {
          transactions: [
            {
              from: createC2CTransDto.from,
              to: createC2CTransDto.id,
              value: createC2CTransDto.sum,
              date: new Date(),
              comment:
                createC2CTransDto.comment === '' || null || undefined
                  ? createC2CTransDto.sum < 0
                    ? 'Outcome'
                    : 'Income'
                  : createC2CTransDto.comment,
            },
          ],
        },
      },
    );

    return;
  }

  async getBalance(id: string, currency: string) {
    const user = await this.balanceModel.findOne({ id });
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }
    if (currency !== undefined || currency !== null) {
      const courses = await getCoursesService();
      const targetCourses = courses.find(i => i.ccy === currency);

      const balance = user.balance / targetCourses.buy;

      return {
        balance: balance,
        currency: currency,
      };
    }

    return {
      balance: user.balance,
      currency: 'UAH',
    };
  }

  async getTrans(id: string) {
    return `This action returns a #${id} balance`;
  }
}
