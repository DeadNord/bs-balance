import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateC2CTransDto } from './dto/create-c2c-trans.dto copy';
import { CreateTransDto } from './dto/create-trans.dto';
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
      });

      await this.balanceModel.findOneAndUpdate(
        { id: createTransDto.id },
        {
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
      );
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

    return 'This action adds a new balance';
  }

  async createC2CTrans(createC2CTransDto: CreateC2CTransDto) {
    return 'This action adds a new balance';
  }

  async getBalance(id: string) {
    return `This action returns all balance`;
  }

  async getTrans(id: string) {
    return `This action returns a #${id} balance`;
  }
}
