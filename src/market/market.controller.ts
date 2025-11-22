import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { MarketService } from './market.service';
import { CreateProductDto } from './dto/create-product.dto';
import { CreateContractDto } from './dto/create-contract.dto';

@Controller()
export class MarketController {
    constructor(private readonly marketService: MarketService) { }

    @Post('contracts')
    createContract(@Body() createContractDto: CreateContractDto) {
        return this.marketService.createContract(createContractDto);
    }

    @Get('contracts')
    findAllContracts() {
        return this.marketService.findAllContracts();
    }

    @Get('contracts/:id')
    findContractById(@Param('id') id: string) {
        return this.marketService.findContractById(id);
    }

    @Post('products')
    createProduct(@Body() createProductDto: CreateProductDto) {
        return this.marketService.createProduct(createProductDto);
    }

    @Get('products')
    findAllProducts() {
        return this.marketService.findAllProducts();
    }
}
