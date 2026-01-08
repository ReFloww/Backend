import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// UPDATED: Match P2P Lending format
export class ManagerInvestmentAssetDto {
  @ApiProperty({ description: 'Manager contract address (like productId)' })
  managerId: string;

  @ApiProperty({ description: 'Manager name (Asset column)' })
  assetName: string;

  @ApiProperty({ description: 'Risk level or strategy (Sector column)' })
  sector: string;

  @ApiProperty({ description: 'Share balance in tokens (Balance column)' })
  balanceTokens: number;

  @ApiProperty({ description: 'Value in USDT (Value column)' })
  valueUsdt: number;

  @ApiProperty({ description: 'Return percentage APY (Return column)' })
  returnPct: number;

  @ApiPropertyOptional({ description: 'Share percentage of total AUM' })
  sharePercentage?: number;

  @ApiPropertyOptional({ description: 'Manager metadata for additional info' })
  metadata?: {
    description?: string;
    experienceYears?: number;
    strategy?: string;
    totalClients?: number;
  };
}

export class UserManagerInvestmentsListResponseDto {
  @ApiProperty({ description: 'User investments in managers (as assets)', type: [ManagerInvestmentAssetDto] })
  investments: ManagerInvestmentAssetDto[];

  @ApiProperty({ description: 'Total invested across all managers' })
  totalInvested: number;
}
