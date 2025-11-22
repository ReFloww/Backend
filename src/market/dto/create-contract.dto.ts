import { IsNotEmpty, IsString, IsNumber, IsDecimal } from 'class-validator';

export class CreateContractDto {
    @IsNotEmpty()
    @IsString()
    contractAddress: string;

    @IsNotEmpty()
    @IsNumber()
    maxSupply: number;
}
