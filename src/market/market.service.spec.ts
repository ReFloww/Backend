import { Test, TestingModule } from '@nestjs/testing';
import { MarketService } from './market.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('MarketService', () => {
    let service: MarketService;
    let prisma: PrismaService;

    const mockPrismaService = {
        contract: {
            create: jest.fn(),
            findMany: jest.fn(),
            findUnique: jest.fn(),
        },
        product: {
            create: jest.fn(),
            findMany: jest.fn(),
        },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                MarketService,
                { provide: PrismaService, useValue: mockPrismaService },
            ],
        }).compile();

        service = module.get<MarketService>(MarketService);
        prisma = module.get<PrismaService>(PrismaService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('createContract', () => {
        it('should create a contract', async () => {
            const dto = { contractAddress: '0x123', maxSupply: 1000 };
            const result = { id: '1', ...dto, maxSupply: expect.any(Object) }; // Prisma Decimal mock
            mockPrismaService.contract.create.mockResolvedValue(result);

            expect(await service.createContract(dto)).toEqual(result);
            expect(prisma.contract.create).toHaveBeenCalledWith({
                data: { contractAddress: dto.contractAddress, maxSupply: dto.maxSupply },
            });
        });
    });

    describe('findAllContracts', () => {
        it('should return an array of contracts', async () => {
            const result = [{ id: '1', contractAddress: '0x123' }];
            mockPrismaService.contract.findMany.mockResolvedValue(result);

            expect(await service.findAllContracts()).toEqual(result);
        });
    });

    describe('findContractById', () => {
        it('should return a contract if found', async () => {
            const result = { id: '1', contractAddress: '0x123' };
            mockPrismaService.contract.findUnique.mockResolvedValue(result);

            expect(await service.findContractById('1')).toEqual(result);
        });

        it('should throw NotFoundException if not found', async () => {
            mockPrismaService.contract.findUnique.mockResolvedValue(null);

            await expect(service.findContractById('1')).rejects.toThrow(NotFoundException);
        });
    });

    describe('createProduct', () => {
        it('should create a product if contract exists', async () => {
            const dto = {
                productName: 'Test Product',
                categoryId: 'cat1',
                description: 'Desc',
                loanInterest: 10,
                loanAmount: 1000,
                loanTenor: 12,
                creditRate: 'A',
                contractId: '1',
            };

            mockPrismaService.contract.findUnique.mockResolvedValue({ id: '1' });
            mockPrismaService.product.create.mockResolvedValue({ id: 'p1', ...dto });

            const result = await service.createProduct(dto);
            expect(result).toEqual({ id: 'p1', ...dto });
            expect(prisma.contract.findUnique).toHaveBeenCalledWith({ where: { id: '1' } });
        });

        it('should throw NotFoundException if contract does not exist', async () => {
            const dto = {
                productName: 'Test Product',
                categoryId: 'cat1',
                description: 'Desc',
                loanInterest: 10,
                loanAmount: 1000,
                loanTenor: 12,
                creditRate: 'A',
                contractId: '1',
            };

            mockPrismaService.contract.findUnique.mockResolvedValue(null);

            await expect(service.createProduct(dto)).rejects.toThrow(NotFoundException);
        });
    });

    describe('findAllProducts', () => {
        it('should return an array of products with contracts', async () => {
            const result = [{ id: 'p1', contract: { id: '1' } }];
            mockPrismaService.product.findMany.mockResolvedValue(result);

            expect(await service.findAllProducts()).toEqual(result);
            expect(prisma.product.findMany).toHaveBeenCalledWith({ include: { contract: true } });
        });
    });
});
