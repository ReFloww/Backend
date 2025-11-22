import { Injectable, OnModuleInit } from '@nestjs/common';
import { createPublicClient, http } from 'viem';
import { mantleTestnet } from 'viem/chains';

@Injectable()
export class BlockchainService implements OnModuleInit {
    private publicClient;

    onModuleInit() {
        this.publicClient = createPublicClient({
            chain: mantleTestnet,
            transport: http(),
        });
    }

    async getContractInfo(contractAddress: string) {
        // Mock implementation for now
        return {
            address: contractAddress,
            balance: '0',
            network: 'Mantle Testnet',
        };
    }

    getClient() {
        return this.publicClient;
    }
}
