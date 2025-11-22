import { Test, TestingModule } from '@nestjs/testing';
import { ProductDetailController } from './product-detail.controller';
import { ProductDetailService } from './product-detail.service';

describe('ProductDetailController', () => {
    let controller: ProductDetailController;
    let service: ProductDetailService;

    const mockProductDetailService = {
        findOne: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ProductDetailController],
            providers: [
                { provide: ProductDetailService, useValue: mockProductDetailService },
            ],
        }).compile();

        controller = module.get<ProductDetailController>(ProductDetailController);
        service = module.get<ProductDetailService>(ProductDetailService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('findOne', () => {
        it('should call service.findOne', async () => {
            await controller.findOne('1');
            expect(service.findOne).toHaveBeenCalledWith('1');
        });
    });
});
