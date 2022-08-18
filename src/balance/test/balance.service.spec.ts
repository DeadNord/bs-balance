import { Test } from '@nestjs/testing';
import { BalanceService } from '../balance.service';

jest.mock('../balance.service.ts');

describe('BalanceService', () => {
  let balanceService: BalanceService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [],
      providers: [BalanceService],
    }).compile();

    balanceService = moduleRef.get<BalanceService>(BalanceService);
    jest.clearAllMocks();
  });

  it('BalanceService - Should be defined', () => {
    expect(balanceService).toBeDefined();
  });
});
