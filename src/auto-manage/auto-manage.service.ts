import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { BlockchainService } from '../blockchain/blockchain.service';

@Injectable()
export class AutoManageService {
    constructor(
        private prisma: PrismaService,
        private blockchain: BlockchainService,
    ) { }

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
        // Query ownership to find where user has shares (balance > 0)
        const ownerships = await this.prisma.ownership.findMany({
            where: {
                user: wallet,
                type: 'SHARE',
                balance: {
                    gt: new Prisma.Decimal(0),
                },
            },
        });

        if (ownerships.length === 0) {
            return {
                investments: [],
                totalInvested: 0,
            };
        }

        // Get unique contract addresses where user has ownership
        const ownedContractAddresses = ownerships.map(o => o.contract_address);

        // Fetch manager data - ONLY for contracts that are actually manager contracts
        // This ensures we don't try to call manager methods on non-manager contracts
        const managersOnchain = await this.prisma.managerOnchain.findMany({
            where: {
                contract_address: { in: ownedContractAddresses },
            },
        });

        // Early return if no valid manager contracts found
        if (managersOnchain.length === 0) {
            console.log(`No manager contracts found for ${ownedContractAddresses.length} owned contract addresses`);
            return {
                investments: [],
                totalInvested: 0,
            };
        }

        console.log(`Found ${managersOnchain.length} manager contracts for wallet ${wallet}`);

        const investments: Array<{
            managerAddress: string;
            managerName: string;
            depositAmount: number;
            rawDepositAmount: string;
            totalDeposits: number;
            sharePercentage: number;
            sharePrice: number;
            valueUsdt: number;
            metadata?: {
                description: string;
                experienceYears: number;
                maxProfitAPY: number;
                riskLevel: string;
                strategy: string;
                totalClients: number;
            };
        }> = [];

        let totalInvested = 0;

        if (managersOnchain.length > 0) {
            const sequenceIds = managersOnchain.map(m => parseInt(m.sequence_id.toString()));

            const metadataList = await this.prisma.managerMetadata.findMany({
                where: {
                    id: { in: sequenceIds },
                },
            });

            for (const onchain of managersOnchain) {
                try {
                    const userDeposit = await this.blockchain.getManagerDepositForAddress(
                        onchain.contract_address,
                        wallet
                    );
                    const totalDeposits = await this.blockchain.getTotalDeposits(onchain.contract_address);

                    const depositAmount = parseFloat(userDeposit.toString()) / 1000000;

                    // Skip if user has no deposit in this manager
                    if (depositAmount === 0) continue;

                    const totalDepositValue = parseFloat(totalDeposits.toString()) / 1000000;
                    const sharePercentage = totalDepositValue > 0 ? (depositAmount / totalDepositValue) * 100 : 0;

                    const sharePriceValue = parseFloat(onchain.share_price.toString()) / 1000000;
                    const valueUsdt = depositAmount * sharePriceValue;

                    totalInvested += valueUsdt;

                    const metadata = metadataList.find(
                        m => m.id === parseInt(onchain.sequence_id.toString())
                    );

                    investments.push({
                        managerAddress: onchain.contract_address,
                        managerName: onchain.name,
                        depositAmount,
                        rawDepositAmount: userDeposit.toString(),
                        totalDeposits: totalDepositValue,
                        sharePercentage,
                        sharePrice: sharePriceValue,
                        valueUsdt,
                        metadata: metadata
                            ? {
                                description: metadata.description,
                                experienceYears: metadata.experienceYears,
                                maxProfitAPY: parseFloat(metadata.maxProfitAPY?.toString() || '0'),
                                riskLevel: metadata.riskLevel,
                                strategy: metadata.strategy,
                                totalClients: metadata.totalClients,
                            }
                            : undefined,
                    });
                } catch (error) {
                    // Skip this manager if blockchain call fails (invalid contract, RPC error, etc.)
                    console.warn(`Failed to fetch data for manager ${onchain.contract_address}:`, error.message);
                    continue;
                }
            }
        }

        return {
            investments,
            totalInvested,
        };
    }
}
