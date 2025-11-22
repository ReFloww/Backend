import { Controller, Get } from '@nestjs/common';

@Controller('history')
export class HistoryController {
    @Get()
    getHistory() {
        return { message: 'History API stub – not implemented yet' };
    }
}
