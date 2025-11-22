import { Test, TestingModule } from '@nestjs/testing';
import { BlockchainService } from './blockchain.service';

describe('BlockchainService', () => {
    let service: BlockchainService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [BlockchainService],
        }).compile();

        service = module.get<BlockchainService>(BlockchainService);
        service.onModuleInit();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getContractInfo', () => {
        it('should return mock contract info', async () => {
            const address = '0x123';
            const result = await service.getContractInfo(address);
            expect(result).toEqual({
                address,
                balance: '0',
                network: 'Mantle Testnet',
            });
        });
    });

    describe('getClient', () => {
        it('should return the viem public client', () => {
            const client = service.getClient();
            expect(client).toBeDefined();
        });
    });
});
