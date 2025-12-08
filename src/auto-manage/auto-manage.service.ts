import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AutoManageService {
    constructor(private prisma: PrismaService) { }

    async getManagerList() {
        // Get all manager_onchain records
        const managersOnchain = await this.prisma.managerOnchain.findMany();

        // For each manager, join with metadata
        const managerList = await Promise.all(
            managersOnchain.map(async (onchain) => {
                const metadata = await this.prisma.managerMetadata.findUnique({
                    where: { id: parseInt(onchain.sequence_id.toString()) },
                });

                return {
                    // Onchain data
                    id: onchain.id,
                    sequenceId: onchain.sequence_id,
                    contractAddress: onchain.contract_address,
                    name: onchain.name,
                    owner: onchain.owner,
                    createdAt: onchain.created_at,
                    createdAtBlock: onchain.created_at_block,
                    totalFundsManaged: onchain.total_funds_managed,

                    // Metadata
                    description: metadata?.description || null,
                    experienceYears: metadata?.experienceYears || null,
                    maxProfitLAPY: metadata?.maxProfitAPY || null,
                    riskLevel: metadata?.riskLevel || null,
                    strategy: metadata?.strategy || null,
                    assetUnderManagement: metadata?.assetsUnderManagement || null,
                    totalClients: metadata?.totalClients || null,
                };
            })
        );

        return managerList;
    }
}
