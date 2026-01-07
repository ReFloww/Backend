import { Injectable, OnModuleInit } from '@nestjs/common';
import { createPublicClient, http } from 'viem';
import { mantleTestnet } from 'viem/chains';

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
      chain: mantleTestnet,
      transport: http(),
    });
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

  async getManagerDeposit(wallet: string): Promise<bigint> {
    const deposit = await this.publicClient.readContract({
      address: this.managerInvestmentAddress,
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
