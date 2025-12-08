import { Module } from '@nestjs/common';
import { AutoManageController } from './auto-manage.controller';
import { AutoManageService } from './auto-manage.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [AutoManageController],
    providers: [AutoManageService],
})
export class AutoManageModule { }
