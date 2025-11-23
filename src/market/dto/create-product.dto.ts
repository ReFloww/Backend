import { IsNotEmpty, IsString, IsNumber, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
    @ApiProperty({ example: 'Product Name', description: 'The name of the product' })
    @IsNotEmpty()
    @IsString()
    productName: string;

    @ApiProperty({ example: 'category-id', description: 'The category ID of the product' })
    @IsNotEmpty()
    @IsString()
    categoryId: string;

    @ApiProperty({ example: 'Product Description', description: 'The description of the product' })
    @IsNotEmpty()
    @IsString()
    description: string;

    @ApiProperty({ example: 5.5, description: 'The loan interest rate' })
    @IsNotEmpty()
    @IsNumber()
    loanInterest: number;

    @ApiProperty({ example: 1000000, description: 'The loan amount' })
    @IsNotEmpty()
    @IsNumber()
    loanAmount: number;

    @ApiProperty({ example: 12, description: 'The loan tenor in months' })
    @IsNotEmpty()
    @IsInt()
    loanTenor: number;

    @ApiProperty({ example: 'A', description: 'The credit rate of the product' })
    @IsNotEmpty()
    @IsString()
    creditRate: string;

    @ApiProperty({ example: 'contract-id', description: 'The contract ID associated with the product' })
    @IsNotEmpty()
    @IsString()
    contractId: string;
}
