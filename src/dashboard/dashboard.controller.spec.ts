import { Test, TestingModule } from '@nestjs/testing';
import { DashboardController } from './dashboard.controller';

describe('DashboardController', () => {
    let controller: DashboardController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [DashboardController],
        }).compile();

        controller = module.get<DashboardController>(DashboardController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should return not implemented message', () => {
        expect(controller.getDashboard()).toEqual({ message: 'Dashboard API not implemented yet' });
    });
});
