import { Test, TestingModule } from '@nestjs/testing';
import { BalanceController } from './balance.controller';
import { BalanceService } from './balance.service';

describe('BalanceController', () => {
  let controller: BalanceController;

  const mockBalanceService = {
    createTrans: jest.fn(dto => {
      return {
        from: 'BeSocial',
        to: dto.id,
        value: dto.sum,
      };
    }),
    createC2CTrans: jest.fn(dto => {
      return {
        from: dto.from,
        to: dto.id,
        value: dto.sum,
      };
    }),
    getBalance: jest.fn((id, currency) => {
      return {
        balance: 10,
        currency: currency === undefined ? 'USD' : currency,
      };
    }),
    getTrans: jest.fn(dto => {
      return [
        {
          test: 'test',
        },
      ];
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      // imports: [
      //   MongooseModule.forFeature([
      //     { name: Balance.name, schema: balanceSchema },
      //     { name: Transaction.name, schema: transactionSchema },
      //   ]),
      // ],
      controllers: [BalanceController],
      providers: [BalanceService],
    })
      .overrideProvider(BalanceService)
      .useValue(mockBalanceService)
      .compile();

    controller = module.get<BalanceController>(BalanceController);
    // controller = await module.resolve(BalanceController);
    // balanceService = await module.resolve(BalanceService);
  });

  it('BalanceController - Should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Create Trans', async () => {
    const createTransDto = {
      id: 'TTESST3',
      sum: 10,
    };

    const result = {
      from: 'BeSocial',
      to: createTransDto.id,
      value: expect.any(Number),
    };

    expect(await controller.createTrans(createTransDto)).toEqual(result);
  });

  it('Create C2C Trans', async () => {
    const createC2CTransDto = {
      from: 'andj283wofj3ff53',
      id: 'TTESST4',
      sum: 10,
    };

    const result = {
      from: createC2CTransDto.from,
      to: createC2CTransDto.id,
      value: expect.any(Number),
    };

    expect(await controller.createC2CTrans(createC2CTransDto)).toEqual(result);
  });

  it('Get Balance', async () => {
    const res = {
      balance: expect.any(Number),
      currency: 'USD',
    };

    expect(await controller.getBalance('TTESST2', undefined)).toEqual(res);
  });

  it('Get All Trans', async () => {
    const res = [
      {
        test: expect.any(String),
      },
    ];

    const params = {
      page: 1,
      limit: 10,
    };

    expect(await controller.getTrans('TTESST2', params)).toEqual(res);
  });
});
