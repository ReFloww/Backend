import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { MarketModule } from './market/market.module';
import { ProductDetailModule } from './product-detail/product-detail.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { PortfolioModule } from './portfolio/portfolio.module';
import { HistoryModule } from './history/history.module';
import { BlockchainModule } from './blockchain/blockchain.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        PrismaModule,
        MarketModule,
        ProductDetailModule,
        DashboardModule,
        PortfolioModule,
        HistoryModule,
        BlockchainModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule { }
