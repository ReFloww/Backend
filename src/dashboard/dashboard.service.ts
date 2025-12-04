import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MarketService } from '../market/market.service';
import { Prisma } from '@prisma/client';

function toNum(d: Prisma.Decimal | string | number) {
  return Number(d);
}

@Injectable()
export class DashboardService {
  constructor(
    private prisma: PrismaService,
    private marketService: MarketService,
  ) {}

  async getDashboard(walletAddress: string) {
    const portfolioDistribution = await this.getPortfolioDistribution(walletAddress);
    const marketOpportunities = await this.getMarketOpportunities();

    return {
      portfolioDistribution,
      marketOpportunities,
      // performanceOverview → mock di FE (tidak dikirim)
    };
  }

  private async getPortfolioDistribution(wallet: string) {
    const ownerships = await this.prisma.ownership.findMany({
      where: {
        user: wallet,
        balance: { gt: new Prisma.Decimal(0) },
      },
    });

    if (ownerships.length === 0) {
      return {
        totalAssets: 0,
        changeFromLastMonthPct: 12.5, // mock
        sectors: [],
      };
    }

    const contractAddresses = ownerships.map(o => o.contract_address);

    const contracts = await this.prisma.contract.findMany({
      where: { contractAddress: { in: contractAddresses } },
      include: { products: true },
    });

    const sectorMap: Record<string, number> = {};
    let totalAssets = 0;

    for (const c of contracts) {
      for (const p of c.products) {
        totalAssets += 1;

        if (!sectorMap[p.categoryId]) {
          sectorMap[p.categoryId] = 0;
        }
        sectorMap[p.categoryId] += 1;
      }
    }

    const sectors = Object.entries(sectorMap).map(([sector, count]) => ({
      name: sector,
      percentage: Number(((count / totalAssets) * 100).toFixed(1)),
      assetCount: count,
    }));

    return {
      totalAssets,
      changeFromLastMonthPct: 12.5, // mock
      sectors,
    };
  }

  private async getMarketOpportunities() {
    const allProducts = await this.marketService.findAllProducts();
    const featured = allProducts.slice(0, 3);

    return featured.map((p: any) => ({
      id: p.id,
      name: p.productName,
      sector: p.categoryId,
      rating: p.creditRate,
      amount: toNum(p.loanAmount),
      rateAnnualPct: toNum(p.loanInterest),
      tenorMonths: p.loanTenor,
    }));
  }
}
