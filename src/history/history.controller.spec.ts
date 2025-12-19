import { Test, TestingModule } from '@nestjs/testing';
import { HistoryController } from './history.controller';
import { HistoryService } from './history.service';

describe('HistoryController', () => {
    let controller: HistoryController;
    let service: HistoryService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [HistoryController],
            providers: [
                {
                    provide: HistoryService,
                    useValue: {
                        getTransactionHistory: jest.fn().mockResolvedValue([]),
                        getRepaymentHistory: jest.fn().mockResolvedValue([]),
                    },
                },
            ],
        }).compile();

        controller = module.get<HistoryController>(HistoryController);
        service = module.get<HistoryService>(HistoryService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('getTransactions', () => {
        it('should return error if user address is not provided', async () => {
            const result = await controller.getTransactions('');
            expect(result).toEqual({ error: 'User address is required' });
        });

        it('should call service.getTransactionHistory with user address', async () => {
            const userAddress = '0x1234567890abcdef';
            await controller.getTransactions(userAddress);
            expect(service.getTransactionHistory).toHaveBeenCalledWith(userAddress);
        });
    });

    describe('getRepayments', () => {
        it('should return error if user address is not provided', async () => {
            const result = await controller.getRepayments('');
            expect(result).toEqual({ error: 'User address is required' });
        });

        it('should call service.getRepaymentHistory with user address', async () => {
            const userAddress = '0x1234567890abcdef';
            await controller.getRepayments(userAddress);
            expect(service.getRepaymentHistory).toHaveBeenCalledWith(userAddress);
        });
    });
});
