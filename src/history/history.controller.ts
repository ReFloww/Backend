import { Controller, Get, Query } from '@nestjs/common';
import { HistoryService } from './history.service';

@Controller('history')
export class HistoryController {
    constructor(private readonly historyService: HistoryService) { }

    @Get('transactions')
    async getTransactions(@Query('user') userAddress: string) {
        if (!userAddress) {
            return { error: 'User address is required' };
        }
        return this.historyService.getTransactionHistory(userAddress);
    }

    @Get('repayments')
    async getRepayments(@Query('user') userAddress: string) {
        if (!userAddress) {
            return { error: 'User address is required' };
        }
        return this.historyService.getRepaymentHistory(userAddress);
    }
}
