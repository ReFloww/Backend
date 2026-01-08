import { Controller, Get, Query } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';

@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) { }

  @Get()
  async getPortfolio(@Query('wallet') wallet?: string) {
    // sementara kalau wallet tidak dikirim, pakai mock
    const walletAddress = wallet ?? '0xMOCK_USER_WALLET';
    return this.portfolioService.getPortfolio(walletAddress.toLowerCase());
  }
}
