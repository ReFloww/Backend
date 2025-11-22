import { Test, TestingModule } from '@nestjs/testing';
import { MarketController } from './market.controller';
import { MarketService } from './market.service';

describe('MarketController', () => {
    let controller: MarketController;
    let service: MarketService;

    const mockMarketService = {
        createContract: jest.fn(),
        findAllContracts: jest.fn(),
        findContractById: jest.fn(),
        createProduct: jest.fn(),
        findAllProducts: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [MarketController],
            providers: [
                { provide: MarketService, useValue: mockMarketService },
            ],
        }).compile();

        controller = module.get<MarketController>(MarketController);
        service = module.get<MarketService>(MarketService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('createContract', () => {
        it('should call service.createContract', async () => {
            const dto = { contractAddress: '0x123', maxSupply: 1000 };
            await controller.createContract(dto);
            expect(service.createContract).toHaveBeenCalledWith(dto);
        });
    });

    describe('findAllContracts', () => {
        it('should call service.findAllContracts', async () => {
            await controller.findAllContracts();
            expect(service.findAllContracts).toHaveBeenCalled();
        });
    });

    describe('findContractById', () => {
        it('should call service.findContractById', async () => {
            await controller.findContractById('1');
            expect(service.findContractById).toHaveBeenCalledWith('1');
        });
    });

    describe('createProduct', () => {
        it('should call service.createProduct', async () => {
            const dto = {
                productName: 'Test',
                categoryId: '1',
                description: 'Desc',
                loanInterest: 10,
                loanAmount: 100,
                loanTenor: 12,
                creditRate: 'A',
                contractId: '1',
            };
            await controller.createProduct(dto);
            expect(service.createProduct).toHaveBeenCalledWith(dto);
        });
    });

    describe('findAllProducts', () => {
        it('should call service.findAllProducts', async () => {
            await controller.findAllProducts();
            expect(service.findAllProducts).toHaveBeenCalled();
        });
    });
});
