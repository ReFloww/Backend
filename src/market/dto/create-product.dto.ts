import { IsNotEmpty, IsString, IsNumber, IsInt } from 'class-validator';

export class CreateProductDto {
    @IsNotEmpty()
    @IsString()
    productName: string;

    @IsNotEmpty()
    @IsString()
    categoryId: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsNumber()
    loanInterest: number;

    @IsNotEmpty()
    @IsNumber()
    loanAmount: number;

    @IsNotEmpty()
    @IsInt()
    loanTenor: number;

    @IsNotEmpty()
    @IsString()
    creditRate: string;

    @IsNotEmpty()
    @IsString()
    contractId: string;
}
