import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductDetailService {
    constructor(private prisma: PrismaService) { }

    async findOne(id: string) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: {
                contract: true,
            },
        });

        if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }

        // Mock computed fields
        return {
            ...product,
            utilization: 0, // Mock
            remainingCapacity: product.loanAmount, // Mock
            riskLabel: 'Low Risk', // Mock
        };
    }
}
