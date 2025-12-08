import { ApiProperty } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime/library';

export class ManagerListResponseDto {
    // Onchain data
    @ApiProperty({ description: 'Manager onchain ID' })
    id: string;

    @ApiProperty({ description: 'Sequence ID (links to metadata)' })
    sequenceId: Decimal;

    @ApiProperty({ description: 'Manager contract address' })
    contractAddress: string;

    @ApiProperty({ description: 'Manager name' })
    name: string;

    @ApiProperty({ description: 'Manager owner address' })
    owner: string;

    @ApiProperty({ description: 'Creation timestamp' })
    createdAt: Decimal;

    @ApiProperty({ description: 'Block number when created' })
    createdAtBlock: Decimal;

    @ApiProperty({ description: 'Total funds managed' })
    totalFundsManaged: Decimal;

    // Metadata fields
    @ApiProperty({ description: 'Manager description', required: false, nullable: true })
    description: string | null;

    @ApiProperty({ description: 'Years of experience', required: false, nullable: true })
    experienceYears: number | null;

    @ApiProperty({ description: 'Maximum profit LAPY (Last Annualized Percentage Yield)', required: false, nullable: true })
    maxProfitLAPY: Decimal | null;

    @ApiProperty({ description: 'Risk level: Low, Medium, High', required: false, nullable: true })
    riskLevel: string | null;

    @ApiProperty({ description: 'Investment strategy', required: false, nullable: true })
    strategy: string | null;

    @ApiProperty({ description: 'Asset under management', required: false, nullable: true })
    assetUnderManagement: Decimal | null;

    @ApiProperty({ description: 'Total number of clients', required: false, nullable: true })
    totalClients: number | null;
}
