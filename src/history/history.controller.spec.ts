import { Test, TestingModule } from '@nestjs/testing';
import { HistoryController } from './history.controller';

describe('HistoryController', () => {
    let controller: HistoryController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [HistoryController],
        }).compile();

        controller = module.get<HistoryController>(HistoryController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should return not implemented message', () => {
        expect(controller.getHistory()).toEqual({ message: 'History API stub – not implemented yet' });
    });
});
