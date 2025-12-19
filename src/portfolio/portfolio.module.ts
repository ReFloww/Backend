import { Module } from '@nestjs/common';
import { PortfolioController } from './portfolio.controller';
import { PortfolioService } from './portfolio.service';
import { PrismaService } from '../prisma/prisma.service';
import { BlockchainService } from '../blockchain/blockchain.service';

@Module({
  controllers: [PortfolioController],
  providers: [PortfolioService, PrismaService, BlockchainService],
})
export class PortfolioModule {}
