import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserManagerInvestmentResponseDto {
  @ApiProperty({ description: 'Manager contract address' })
  managerAddress: string;

  @ApiProperty({ description: 'Manager name' })
  managerName: string;

  @ApiProperty({ description: 'Deposit amount in USDT' })
  depositAmount: number;

  @ApiProperty({ description: 'Raw deposit amount in Wei' })
  rawDepositAmount: string;

  @ApiProperty({ description: 'Total deposits in manager' })
  totalDeposits: number;

  @ApiProperty({ description: 'Share percentage of manager' })
  sharePercentage: number;

  @ApiPropertyOptional({ description: 'Share price from smart contract' })
  sharePrice?: string;

  @ApiPropertyOptional({ description: 'Manager metadata' })
  metadata?: {
    description?: string;
    experienceYears?: number;
    maxProfitAPY?: string;
    riskLevel?: string;
    strategy?: string;
    totalClients?: number;
  };
}

export class UserManagerInvestmentsListResponseDto {
  @ApiProperty({ description: 'User investments in managers', type: [UserManagerInvestmentResponseDto] })
  investments: UserManagerInvestmentResponseDto[];

  @ApiProperty({ description: 'Total invested across all managers' })
  totalInvested: number;
}
