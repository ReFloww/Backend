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

    async getMarketList() {
        // Get all product_onchain records
        const productsOnchain = await this.prisma.productOnchain.findMany();

        // For each product, join with metadata
        const marketList = await Promise.all(
            productsOnchain.map(async (onchain) => {
                const metadata = await this.prisma.productMetadata.findUnique({
                    where: { id: parseInt(onchain.sequence_id.toString()) },
                });

                return {
                    // Onchain data
                    id: onchain.id,
                    contractAddress: onchain.contract_address,
                    name: onchain.name,
                    symbol: onchain.symbol,
                    holderCount: onchain.holder_count,

                    // Metadata
                    description: metadata?.description || null,
                    loanInterest: metadata?.loanInterest || null,
                    loanAmount: metadata?.loanAmount || null,
                    creditRate: metadata?.creditRate || null,
                    categoryId: metadata?.categoryId || null,
                    loanTenor: metadata?.loanTenor || null,
                };
            })
        );

        return marketList;
    }
}
