import { IsEmail, IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
    @ApiProperty({ example: 'test@example.com', description: 'User email address' })
    @IsEmail()
    email!: string;

    @ApiProperty({ example: 'password123', description: 'User password' })
    @IsNotEmpty()
    @IsString()
    password!: string;

    @ApiProperty({ example: 'testuser', description: 'Unique username' })
    @IsNotEmpty()
    @IsString()
    username!: string;

    @ApiPropertyOptional({ example: 'John Doe', description: 'Full name' })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({ example: '0x123...', description: 'Wallet address' })
    @IsOptional()
    @IsString()
    walletAddress?: string;
}
