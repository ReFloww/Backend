import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BlockchainService } from '../blockchain/blockchain.service';

@Injectable()
export class AutoManageService {
    constructor(
        private prisma: PrismaService,
        private blockchain: BlockchainService,
    ) {}

    async getManagerList() {
        const managersOnchain = await this.prisma.managerOnchain.findMany();

        const managerList = await Promise.all(
            managersOnchain.map(async (onchain) => {
                const metadata = await this.prisma.managerMetadata.findUnique({
                    where: { id: parseInt(onchain.sequence_id.toString()) },
                });

                return {
                    id: onchain.id,
                    sequenceId: onchain.sequence_id,
                    contractAddress: onchain.contract_address,
                    name: onchain.name,
                    owner: onchain.owner,
                    createdAt: onchain.created_at,
                    createdAtBlock: onchain.created_at_block,
                    totalFundsManaged: onchain.aum,
                    aum: onchain.aum,
                    totalShares: onchain.total_shares,
                    sharePrice: onchain.share_price,
                    lockedFundValue: onchain.locked_fund_value,
                    liquidFundValue: onchain.liquid_fund_value,
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

    async getManagerById(id: string) {
        const onchain = await this.prisma.managerOnchain.findUnique({
            where: { id },
        });

        if (!onchain) {
            return null;
        }

        const metadata = await this.prisma.managerMetadata.findUnique({
            where: { id: parseInt(onchain.sequence_id.toString()) },
        });

        return {
            id: onchain.id,
            sequenceId: onchain.sequence_id,
            contractAddress: onchain.contract_address,
            name: onchain.name,
            owner: onchain.owner,
            createdAt: onchain.created_at,
            createdAtBlock: onchain.created_at_block,
            totalFundsManaged: onchain.aum,
            aum: onchain.aum,
            totalShares: onchain.total_shares,
            sharePrice: onchain.share_price,
            lockedFundValue: onchain.locked_fund_value,
            liquidFundValue: onchain.liquid_fund_value,
            description: metadata?.description || null,
            experienceYears: metadata?.experienceYears || null,
            maxProfitLAPY: metadata?.maxProfitAPY || null,
            riskLevel: metadata?.riskLevel || null,
            strategy: metadata?.strategy || null,
            assetUnderManagement: metadata?.assetsUnderManagement || null,
            totalClients: metadata?.totalClients || null,
        };
    }

    async getUserManagerInvestments(wallet: string) {
        const managersOnchain = await this.prisma.managerOnchain.findMany();

        const investments = await Promise.all(
            managersOnchain.map(async (onchain) => {
                const userDeposit = await this.blockchain.getManagerDeposit(wallet);
                const totalDeposits = await this.blockchain.getTotalDeposits(onchain.contract_address);
                const metadata = await this.prisma.managerMetadata.findUnique({
                    where: { id: parseInt(onchain.sequence_id.toString()) },
                });

                const depositAmount = parseFloat(userDeposit.toString()) / 1000000;
                const totalDepositValue = parseFloat(totalDeposits.toString()) / 1000000;
                const sharePercentage = totalDepositValue > 0 ? (depositAmount / totalDepositValue) * 100 : 0;

                return {
                    managerAddress: onchain.contract_address,
                    managerName: onchain.name,
                    depositAmount,
                    rawDepositAmount: userDeposit.toString(),
                    totalDeposits: totalDepositValue,
                    sharePercentage,
                    sharePrice: onchain.share_price,
                    metadata: metadata
                        ? {
                              description: metadata.description,
                              experienceYears: metadata.experienceYears,
                              maxProfitAPY: metadata.maxProfitAPY,
                              riskLevel: metadata.riskLevel,
                              strategy: metadata.strategy,
                              totalClients: metadata.totalClients,
                          }
                        : undefined,
                };
            })
        );

        const userInvestments = investments.filter((inv) => inv.depositAmount > 0);
        const totalInvested = userInvestments.reduce((sum, inv) => sum + inv.depositAmount, 0);

        return {
            investments: userInvestments,
            totalInvested,
        };
    }
}
