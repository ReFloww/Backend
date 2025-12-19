import { ApiProperty } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime/library';

export class MarketListResponseDto {
    @ApiProperty({ description: 'Onchain product ID' })
    id: string;

    @ApiProperty({ description: 'Contract address' })
    contractAddress: string;

    @ApiProperty({ description: 'Product name from blockchain' })
    name: string;

    @ApiProperty({ description: 'Token symbol' })
    symbol: string;

    @ApiProperty({ description: 'Number of token holders' })
    holderCount: Decimal;

    @ApiProperty({ description: 'Product status' })
    status: string;

    // Metadata fields
    @ApiProperty({ description: 'Product description', required: false, nullable: true })
    description: string | null;

    @ApiProperty({ description: 'Loan interest rate', required: false, nullable: true })
    loanInterest: Decimal | null;

    @ApiProperty({ description: 'Loan amount', required: false, nullable: true })
    loanAmount: Decimal | null;

    @ApiProperty({ description: 'Credit rate/rating', required: false, nullable: true })
    creditRate: string | null;

    @ApiProperty({ description: 'Category ID', required: false, nullable: true })
    categoryId: string | null;

    @ApiProperty({ description: 'Loan tenor in months', required: false, nullable: true })
    loanTenor: number | null;
}
