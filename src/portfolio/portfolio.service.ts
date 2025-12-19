import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { BlockchainService } from '../blockchain/blockchain.service';

function toNum(
  d: Prisma.Decimal | number | string | null | undefined,
): number {
  if (d === null || d === undefined) return 0;
  return Number(d);
}

@Injectable()
export class PortfolioService {
  constructor(
    private prisma: PrismaService,
    private blockchain: BlockchainService,
  ) {}

  async getPortfolio(walletAddress: string) {
    const [ownerships, usdtBalance] = await Promise.all([
      this.prisma.ownership.findMany({
        where: {
          user: walletAddress,
          balance: {
            gt: new Prisma.Decimal(0),
          },
        },
      }),
      this.getTotalUsdtBalance(walletAddress),
    ]);

    const assets: Array<{
      productId: string;
      assetName: string;
      sector: string;
      balanceTokens: number;
      valueUsdt: number;
      returnPct: number;
    }> = [];

    let totalInvested = 0;

    if (ownerships.length > 0) {
      const contractAddresses = ownerships.map((o) => o.contract_address);

      const contracts = await this.prisma.contract.findMany({
        where: {
          contractAddress: { in: contractAddresses },
        },
        include: {
          products: true,
        },
      });

      for (const own of ownerships) {
        const contract = contracts.find(
          (c) => c.contractAddress === own.contract_address,
        );
        if (!contract) continue;

        const product = contract.products[0];
        if (!product) continue;

        const balanceTokens = toNum(own.balance);

        const maxSupply = toNum(contract.maxSupply);
        const loanAmount = toNum(product.loanAmount);

        const pricePerToken = maxSupply > 0 ? loanAmount / maxSupply : 0;
        const valueUsdt = balanceTokens * pricePerToken;

        const returnPct = 8.2;

        totalInvested += valueUsdt;

        assets.push({
          productId: product.id,
          assetName: product.productName,
          sector: product.categoryId,
          balanceTokens,
          valueUsdt,
          returnPct,
        });
      }
    }

    const activeAssets = assets.length;
    const totalPortfolioValue = totalInvested + usdtBalance;

    return {
      summary: {
        totalPortfolioValue,
        usdtBalance,
        totalInvested,
        activeAssets,
      },
      assets,
    };
  }

  private async getTotalUsdtBalance(wallet: string): Promise<number> {
    const [walletRaw, managerRaw] = await Promise.all([
      this.blockchain.getUsdtWalletBalance(wallet),
      this.blockchain.getManagerDeposit(wallet),
    ]);

    const totalRaw = walletRaw + managerRaw; 

    const balance = Number(totalRaw) / 1e6;

    return balance;
  }
}
