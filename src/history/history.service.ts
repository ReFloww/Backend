import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HistoryService {
    constructor(private prisma: PrismaService) { }

    async getTransactionHistory(userAddress: string) {
        const transactions = await this.prisma.transactionLogs.findMany({
            where: {
                user: userAddress.toLowerCase(),
            },
            orderBy: {
                timestamp: 'desc',
            },
        });

        return transactions.map((tx) => ({
            id: tx.id,
            type: tx.type,
            from: tx.contract_address,
            to: tx.related_address || '',
            amountIn: tx.amount_in.toString(),
            amountOut: tx.amount_out.toString(),
            transactionHash: tx.transaction_hash,
            timestamp: tx.timestamp.toString(),
            blockNumber: tx.block_number.toString(),
        }));
    }

    async getRepaymentHistory(userAddress: string) {
        // First, get all contract addresses where user has ownership
        const ownerships = await this.prisma.ownership.findMany({
            where: {
                user: userAddress.toLowerCase(),
            },
            select: {
                contract_address: true,
            },
        });

        const contractAddresses = ownerships.map((o) => o.contract_address);

        if (contractAddresses.length === 0) {
            return [];
        }

        // Get repayment logs for those contracts
        const repayments = await this.prisma.repaymentLogs.findMany({
            where: {
                contract_address: {
                    in: contractAddresses,
                },
            },
            orderBy: {
                timestamp: 'desc',
            },
        });

        return repayments.map((rep) => ({
            id: rep.id,
            contractAddress: rep.contract_address,
            repaymentNumber: rep.repayment_number.toString(),
            principalPaid: rep.principal_paid.toString(),
            interestPaid: rep.interest_paid.toString(),
            totalDistributed: rep.total_distributed.toString(),
            remainingPrincipal: rep.remaining_principal.toString(),
            transactionHash: rep.transaction_hash,
            timestamp: rep.timestamp.toString(),
            blockNumber: rep.block_number.toString(),
        }));
    }
}
