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
            return {
                investments: [],
                totalInvested: 0,
            };
        }

        const investments: Array<{
            managerId: string;
            assetName: string;
            sector: string;
            balanceTokens: number;
            valueUsdt: number;
            returnPct: number;
            sharePercentage?: number;
            metadata?: {
                description?: string;
                experienceYears?: number;
                strategy?: string;
                totalClients?: number;
            };
        }> = [];

        let totalInvested = 0;

        if (managersOnchain.length > 0) {
            // Create ownership map for efficient lookup
            const ownershipMap = new Map();
            ownerships.forEach(own => {
                ownershipMap.set(own.contract_address, own);
            });

            const sequenceIds = managersOnchain.map(m => parseInt(m.sequence_id.toString()));

            const metadataList = await this.prisma.managerMetadata.findMany({
                where: {
                    id: { in: sequenceIds },
                },
            });

            for (const onchain of managersOnchain) {
                try {
                    // Get ownership data from database instead of blockchain
                    const ownership = ownershipMap.get(onchain.contract_address);
                    if (!ownership) {
                        console.warn(`No ownership found for manager ${onchain.contract_address}`);
                        continue;
                    }

                    // Calculate balance from ownership (shares owned by user)
                    const shareBalance = parseFloat(ownership.balance.toString()) / 1000000;

                    // Skip if user has no shares
                    if (shareBalance === 0) continue;

                    // Get manager data from database
                    const totalShares = parseFloat(onchain.total_shares.toString()) / 1000000;
                    const sharePriceValue = parseFloat(onchain.share_price.toString()) / 1000000;
                    const aum = parseFloat(onchain.aum.toString()) / 1000000;

                    // Calculate share percentage
                    const sharePercentage = totalShares > 0 ? (shareBalance / totalShares) * 100 : 0;

                    // Calculate value in USDT
                    const valueUsdt = shareBalance * sharePriceValue;

                    totalInvested += valueUsdt;

                    const metadata = metadataList.find(
                        m => m.id === parseInt(onchain.sequence_id.toString())
                    );

                    investments.push({
                        managerId: onchain.contract_address,
                        assetName: onchain.name,
                        sector: metadata?.riskLevel || 'Unknown',
                        balanceTokens: shareBalance,
                        valueUsdt,
                        returnPct: metadata?.maxProfitAPY ? parseFloat(metadata.maxProfitAPY.toString()) : 0,
                        sharePercentage,
                        metadata: metadata
                            ? {
                                description: metadata.description,
                                experienceYears: metadata.experienceYears,
                                strategy: metadata.strategy,
                                totalClients: metadata.totalClients,
                            }
                            : undefined,
                    });
                } catch (error) {
                    console.warn(`Failed to process manager ${onchain.contract_address}:`, error.message);
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
