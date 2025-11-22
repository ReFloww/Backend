import { Controller, Get } from '@nestjs/common';

@Controller('portfolio')
export class PortfolioController {
    @Get()
    getPortfolio() {
        return { message: 'Portfolio API stub – not implemented yet' };
    }
}
