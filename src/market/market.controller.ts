import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { MarketService } from './market.service';
import { CreateProductDto } from './dto/create-product.dto';
import { CreateContractDto } from './dto/create-contract.dto';
import { MarketListResponseDto } from './dto/market-list-response.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Market')
@Controller('market')
export class MarketController {
    constructor(private readonly marketService: MarketService) { }

    @Post('contracts')
    @ApiOperation({ summary: 'Create a new contract' })
    @ApiResponse({ status: 201, description: 'The contract has been successfully created.' })
    createContract(@Body() createContractDto: CreateContractDto) {
        return this.marketService.createContract(createContractDto);
    }

    @Get('contracts')
    @ApiOperation({ summary: 'Get all contracts' })
    @ApiResponse({ status: 200, description: 'Return all contracts.' })
    findAllContracts() {
        return this.marketService.findAllContracts();
    }

    @Get('contracts/:id')
    @ApiOperation({ summary: 'Get contract by ID' })
    @ApiParam({ name: 'id', description: 'Contract ID' })
    @ApiResponse({ status: 200, description: 'Return the contract.' })
    @ApiResponse({ status: 404, description: 'Contract not found.' })
    findContractById(@Param('id') id: string) {
        return this.marketService.findContractById(id);
    }

    @Post('products')
    @ApiOperation({ summary: 'Create a new product' })
    @ApiResponse({ status: 201, description: 'The product has been successfully created.' })
    createProduct(@Body() createProductDto: CreateProductDto) {
        return this.marketService.createProduct(createProductDto);
    }

    @Get('products')
    @ApiOperation({ summary: 'Get all products' })
    @ApiResponse({ status: 200, description: 'Return all products.' })
    findAllProducts() {
        return this.marketService.findAllProducts();
    }

    @Get('list')
    @ApiOperation({ summary: 'Get market list with combined product data' })
    @ApiResponse({
        status: 200,
        description: 'Return all products with onchain and metadata combined.',
        type: [MarketListResponseDto]
    })
    getMarketList() {
        return this.marketService.getMarketList();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get market product by ID (Sequence ID)' })
    @ApiParam({ name: 'id', description: 'Product Sequence ID' })
    @ApiResponse({
        status: 200,
        description: 'Return the product with onchain and metadata combined.',
        type: MarketListResponseDto
    })
    @ApiResponse({ status: 404, description: 'Product not found.' })
    getMarketProductById(@Param('id') id: string) {
        return this.marketService.getMarketProductById(id);
    }
}
