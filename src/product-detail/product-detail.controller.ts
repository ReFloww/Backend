import { Controller, Get, Param } from '@nestjs/common';
import { ProductDetailService } from './product-detail.service';

@Controller('product-detail')
export class ProductDetailController {
    constructor(private readonly productDetailService: ProductDetailService) { }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.productDetailService.findOne(id);
    }
}
