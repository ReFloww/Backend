import { Test, TestingModule } from '@nestjs/testing';
import { ProductDetailService } from './product-detail.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('ProductDetailService', () => {
    let service: ProductDetailService;
    let prisma: PrismaService;

    const mockPrismaService = {
        product: {
            findUnique: jest.fn(),
        },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProductDetailService,
                { provide: PrismaService, useValue: mockPrismaService },
            ],
        }).compile();

        service = module.get<ProductDetailService>(ProductDetailService);
        prisma = module.get<PrismaService>(PrismaService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findOne', () => {
        it('should return a product with computed fields if found', async () => {
            const product = {
                id: '1',
                productName: 'Test',
                loanAmount: 1000,
                contract: { id: 'c1' },
            };
            mockPrismaService.product.findUnique.mockResolvedValue(product);

            const result = await service.findOne('1');
            expect(result).toEqual({
                ...product,
                utilization: 0,
                remainingCapacity: 1000,
                riskLabel: 'Low Risk',
            });
            expect(prisma.product.findUnique).toHaveBeenCalledWith({
                where: { id: '1' },
                include: { contract: true },
            });
        });

        it('should throw NotFoundException if not found', async () => {
            mockPrismaService.product.findUnique.mockResolvedValue(null);

            await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
        });
    });
});
