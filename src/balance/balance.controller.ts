import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BalanceService } from './balance.service';
import { CreateC2CTransDto } from './dto/create-c2c-trans.dto copy';
import { CreateTransDto } from './dto/create-trans.dto';

@ApiTags('balance')
@Controller('balance')
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @ApiOperation({ summary: 'Create Transaction' })
  @Post()
  async createTrans(@Body() createTransDto: CreateTransDto) {
    return this.balanceService.createTrans(createTransDto);
  }

  @ApiOperation({ summary: 'Create C2C Transaction' })
  @Post('c2c')
  async createC2CTrans(@Body() createC2CTransDto: CreateC2CTransDto) {
    return this.balanceService.createC2CTrans(createC2CTransDto);
  }

  @ApiOperation({ summary: 'Get User Balance' })
  @Get('/user-balance:id')
  async getBalance(@Param('id') id: string) {
    return this.balanceService.getBalance(id);
  }

  @ApiOperation({ summary: 'get All User Transactions' })
  @Get('/transactions:id')
  async getTrans(@Param('id') id: string) {
    return this.balanceService.getTrans(id);
  }
}
