import { balanceStub } from '../test/stubs/balance.stub';

export const BalanceService = jest.fn().mockReturnValue({
  createTrans: jest.fn().mockReturnValue(balanceStub()),
  createC2CTrans: jest.fn().mockReturnValue(balanceStub()),
  getBalance: jest.fn().mockReturnValue(balanceStub()),
  getTrans: jest.fn().mockReturnValue(balanceStub()),
});
