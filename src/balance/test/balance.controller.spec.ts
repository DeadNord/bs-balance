import { Test } from '@nestjs/testing';
import { BalanceController } from '../balance.controller';
import { BalanceService } from '../balance.service';
import { CreateC2CTransDto } from '../dto/create-c2c-trans.dto';
import { CreateTransDto } from '../dto/create-trans.dto';
import { CurrencyDto } from '../dto/currency.dto';
import { PaginateDto } from '../dto/paginate.dto';
import { Balance } from '../schemas/balance.schema';
import { balanceStub } from './stubs/balance.stub';

jest.mock('../balance.service.ts');

describe('BalanceController', () => {
  let balanceController: BalanceController;
  let balanceService: BalanceService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [],
      controllers: [BalanceController],
      providers: [BalanceService],
    }).compile();

    balanceController = moduleRef.get<BalanceController>(BalanceController);
    balanceService = moduleRef.get<BalanceService>(BalanceService);
    jest.clearAllMocks();
  });

  it('BalanceController - Should be defined', () => {
    expect(balanceController).toBeDefined();
  });

  describe('createTrans', () => {
    describe('When createTrans is called', () => {
      let createTransDto: CreateTransDto;

      beforeEach(async () => {
        createTransDto = {
          id: 'TTESST2',
          sum: 10,
        };

        await balanceController.createTrans(createTransDto);
      });

      test('then it should call balanceService', () => {
        expect(balanceService.createTrans).toBeCalledWith(createTransDto);
      });
    });
  });

  describe('createC2CTrans', () => {
    describe('When createC2CTrans is called', () => {
      let createC2CTransDto: CreateC2CTransDto;

      beforeEach(async () => {
        createC2CTransDto = {
          from: 'andj283wofj3ff53',
          id: 'TTESST2',
          sum: 10,
        };

        await balanceController.createC2CTrans(createC2CTransDto);
      });

      test('then it should call balanceService', () => {
        expect(balanceService.createC2CTrans).toBeCalledWith(createC2CTransDto);
      });
    });
  });

  describe('getBalance', () => {
    describe('When getBalance is called', () => {
      let balance: Balance;
      let currencyDto: CurrencyDto;

      beforeEach(async () => {
        currencyDto = { currency: 'USD' };

        balance = await balanceController.getBalance(
          balanceStub().id,
          currencyDto,
        );
      });

      test('then it should call balanceService', () => {
        expect(balanceService.getBalance).toBeCalledWith(
          balanceStub().id,
          currencyDto,
        );
      });

      test('then it should call Balance', () => {
        expect(balance).toEqual(balanceStub());
      });
    });
  });

  describe('getTrans', () => {
    describe('When getTrans is called', () => {
      let params: PaginateDto;

      beforeEach(async () => {
        params = {
          page: 1,
          limit: 10,
        };

        await balanceController.getTrans(balanceStub().id, params);
      });

      test('then it should call balanceService', () => {
        expect(balanceService.getTrans).toBeCalledWith(
          balanceStub().id,
          params.page,
          params.limit,
        );
      });
    });
  });
});
