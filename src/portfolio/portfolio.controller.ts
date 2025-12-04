import { Controller, Get } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';

@Controller('portfolio')
export class PortfolioController {
    constructor(private readonly portfolioService: PortfolioService) {}

    @Get('/data')
    getPortfolio() {
        return this.portfolioService.getPortfolioData();
    }
}
