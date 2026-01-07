import { Module } from '@nestjs/common';
import { AutoManageController } from './auto-manage.controller';
import { AutoManageService } from './auto-manage.service';
import { PrismaModule } from '../prisma/prisma.module';
import { BlockchainModule } from '../blockchain/blockchain.module';

@Module({
    imports: [PrismaModule, BlockchainModule],
    controllers: [AutoManageController],
    providers: [AutoManageService],
})
export class AutoManageModule {}
