import { IsNotEmpty, IsString, IsNumber, IsDecimal } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateContractDto {
    @ApiProperty({ example: '0x1234567890abcdef1234567890abcdef12345678', description: 'The address of the contract' })
    @IsNotEmpty()
    @IsString()
    contractAddress: string;

    @ApiProperty({ example: 1000, description: 'The maximum supply of the contract' })
    @IsNotEmpty()
    @IsNumber()
    maxSupply: number;
}
