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

// ABI sederhana untuk ManagerInvestment.userDeposits
const managerInvestmentAbi = [
  {
    name: 'userDeposits',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [{ name: 'amount', type: 'uint256' }],
  },
] as const;

@Injectable()
export class BlockchainService implements OnModuleInit {
  private publicClient: any;

  // alamat kontrak di Mantle Sepolia
  private readonly usdtAddress =
    '0xe01c5464816a544d4d0d6a336032578bd4629F10';

  private readonly managerInvestmentAddress =
    '0x0e5e7fc419fe944fa3ed1db55958f81e13c26727';

  onModuleInit() {
    this.publicClient = createPublicClient({
      chain: mantleTestnet,
      transport: http(),
    });
  }

  // --- method lamamu, tetap ada ---
  async getContractInfo(contractAddress: string) {
    // Masih mock, kalau mau bisa di-upgrade nanti
    return {
      address: contractAddress,
      balance: '0',
      network: 'Mantle Testnet',
    };
  }

  getClient() {
    return this.publicClient;
  }

  // ===============================
  // USDT & Manager Investment helpers
  // ===============================

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
}
 