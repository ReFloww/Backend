import { Controller, Get, Param } from '@nestjs/common';
import { ProductDetailService } from './product-detail.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Product Detail')
@Controller('product-detail')
export class ProductDetailController {
    constructor(private readonly productDetailService: ProductDetailService) { }

    @Get(':id')
    @ApiOperation({ summary: 'Get product detail by ID' })
    @ApiParam({ name: 'id', description: 'Product ID' })
    @ApiResponse({ status: 200, description: 'Product detail found.' })
    @ApiResponse({ status: 404, description: 'Product not found.' })
    findOne(@Param('id') id: string) {
        return this.productDetailService.findOne(id);
    }
}
