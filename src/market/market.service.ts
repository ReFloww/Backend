import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { CreateContractDto } from './dto/create-contract.dto';

@Injectable()
export class MarketService {
    constructor(private prisma: PrismaService) { }

    async createContract(data: CreateContractDto) {
        return this.prisma.contract.create({
            data: {
                contractAddress: data.contractAddress,
                maxSupply: data.maxSupply,
            },
        });
    }

    async findAllContracts() {
        return this.prisma.contract.findMany();
    }

    async findContractById(id: string) {
        const contract = await this.prisma.contract.findUnique({
            where: { id },
        });
        if (!contract) throw new NotFoundException(`Contract with ID ${id} not found`);
        return contract;
    }

    async createProduct(data: CreateProductDto) {
        // Verify contract exists
        await this.findContractById(data.contractId);

        return this.prisma.product.create({
            data: {
                productName: data.productName,
                categoryId: data.categoryId,
                description: data.description,
                loanInterest: data.loanInterest,
                loanAmount: data.loanAmount,
                loanTenor: data.loanTenor,
                creditRate: data.creditRate,
                contractId: data.contractId,
            },
        });
    }

    async findAllProducts() {
        return this.prisma.product.findMany({
            include: {
                contract: true,
            },
        });
    }
}
