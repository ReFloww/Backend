import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { PrismaService } from '../prisma/prisma.service';
import { MarketService } from '../market/market.service';

@Module({
  controllers: [DashboardController],
  providers: [DashboardService, PrismaService, MarketService],
})
export class DashboardModule {}
