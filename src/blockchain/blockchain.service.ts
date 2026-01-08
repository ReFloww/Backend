import { Injectable, OnModuleInit } from '@nestjs/common';
import { createPublicClient, http, defineChain } from 'viem';

// Define Mantle Sepolia chain with correct RPC endpoint
const mantleSepolia = defineChain({
  id: 5003,
  name: 'Mantle Sepolia Testnet',
  network: 'mantle-sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'MNT',
    symbol: 'MNT',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.sepolia.mantle.xyz'],
    },
    public: {
      http: ['https://rpc.sepolia.mantle.xyz'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Mantle Sepolia Explorer',
      url: 'https://sepolia.mantlescan.xyz',
    },
  },
  testnet: true,
});

const erc20Abi = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: 'balance', type: 'uint256' }],
  },
] as const;

const managerInvestmentAbi = [
  {
    name: 'userDeposits',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [{ name: 'amount', type: 'uint256' }],
  },
  {
    name: 'totalDeposits',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: 'amount', type: 'uint256' }],
  },
] as const;

@Injectable()
export class BlockchainService implements OnModuleInit {
  private publicClient: any;

  private readonly usdtAddress =
    '0xe01c5464816a544d4d0d6a336032578bd4629F10';



  onModuleInit() {
    this.publicClient = createPublicClient({
      chain: mantleSepolia, // Use custom Mantle Sepolia config
      transport: http('https://rpc.sepolia.mantle.xyz'), // Explicit RPC URL
    });
    console.log('✅ Blockchain service initialized with Mantle Sepolia RPC');
  }

  async getContractInfo(contractAddress: string) {
    return {
      address: contractAddress,
      balance: '0',
      network: 'Mantle Testnet',
    };
  }

  getClient() {
    return this.publicClient;
  }

  async getUsdtWalletBalance(wallet: string): Promise<bigint> {
    const balance = await this.publicClient.readContract({
      address: this.usdtAddress,
      abi: erc20Abi,
      functionName: 'balanceOf',
      args: [wallet],
    });

    return balance as bigint;
  }

  /**
   * @deprecated This method is INCORRECT - it uses wallet address as contract address
   * Use getManagerDepositForAddress(managerAddress, wallet) instead
   */
  async getManagerDeposit(wallet: string): Promise<bigint> {
    const deposit = await this.publicClient.readContract({
      address: wallet as `0x${string}`,
      abi: managerInvestmentAbi,
      functionName: 'userDeposits',
      args: [wallet],
    });

    return deposit as bigint;
  }

  async getManagerDepositForAddress(managerAddress: string, wallet: string): Promise<bigint> {
    const deposit = await this.publicClient.readContract({
      address: managerAddress as `0x${string}`,
      abi: managerInvestmentAbi,
      functionName: 'userDeposits',
      args: [wallet],
    });

    return deposit as bigint;
  }

  async getTotalDeposits(managerAddress: string): Promise<bigint> {
    const totalDeposits = await this.publicClient.readContract({
      address: managerAddress as `0x${string}`,
      abi: managerInvestmentAbi,
      functionName: 'totalDeposits',
      args: [],
    });

    return totalDeposits as bigint;
  }
}
