import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { BalanceService } from '../balance.service';
import {
  Balance,
  balanceDocument,
  balanceSchema,
} from '../schemas/balance.schema';
import { Transaction, transactionSchema } from '../schemas/transactons.schema';

describe('BalanceService', () => {
  let service: BalanceService;
  let mockBalanceModel: Model<balanceDocument>;

  const mockBalanceService = {
    getBalance: jest.fn(async (id, currency) => {
      const user = await mockBalanceModel.findOne({ id: id });

      return {
        balance: user.balance,
        currency: currency === undefined ? 'USD' : currency,
      };
    }),
  };

  beforeEach(async () => {
    // function mockUserModel(dto: any) {
    //   this.data = dto;
    //   this.save = () => {
    //     return this.data;
    //   };
    // }

    const module: TestingModule = await Test.createTestingModule({
      // imports: [
      //   MongooseModule.forFeature([
      //     { name: Balance.name, schema: balanceSchema },
      //     { name: Transaction.name, schema: transactionSchema },
      //   ]),
      // ],

      providers: [
        BalanceService,
        {
          provide: getModelToken(Balance.name),
          useValue: Model,
        },
      ],
    })
      .overrideProvider(BalanceService)
      .useValue(mockBalanceService)
      .compile();

    service = module.get<BalanceService>(BalanceService);
    mockBalanceModel = module.get<Model<balanceDocument>>(
      getModelToken(Balance.name),
    );
  });

  it('BalanceService - Should be defined', () => {
    expect(service).toBeDefined();
  });

  // it('Create Trans', async () => {
  //   const createTransDto = {
  //     id: 'TTESST3',
  //     sum: 10,
  //   };

  //   const res = {
  //     from: 'BeSocial',
  //     to: createTransDto.id,
  //     value: createTransDto.sum,
  //   };

  //   expect(await service.createTrans(createTransDto)).toEqual(res);
  // });

  // it('Create C2C Trans', () => {
  //   const createC2CTransDto = {
  //     from: 'andj283wofj3ff53',
  //     id: 'TTESST4',
  //     sum: 10,
  //   };

  //   expect(controller.createC2CTrans(createC2CTransDto)).toEqual(201);
  // });

  it('Get Balance', async () => {
    const dto = {
      id: 'TTESST2',
    };

    // const user = await mockBalanceModel.findOne({ id: dto.id });

    const res = {
      balance: expect.any(Number),
      currency: 'USD',
    };
    expect(service.getBalance(dto.id, undefined)).toEqual(res);
  });

  // it('Get All Trans', () => {
  //   expect(controller.getTrans('TTESST2', undefined)).toEqual(200);
  // });
});
