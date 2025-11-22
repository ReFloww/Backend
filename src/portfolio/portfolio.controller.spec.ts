import { Test, TestingModule } from '@nestjs/testing';
import { PortfolioController } from './portfolio.controller';

describe('PortfolioController', () => {
    let controller: PortfolioController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PortfolioController],
        }).compile();

        controller = module.get<PortfolioController>(PortfolioController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should return not implemented message', () => {
        expect(controller.getPortfolio()).toEqual({ message: 'Portfolio API stub – not implemented yet' });
    });
});
