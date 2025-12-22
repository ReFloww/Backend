import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { AutoManageService } from './auto-manage.service';
import { ManagerListResponseDto } from './dto/manager-list-response.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Investment-Funds')
@Controller('investment-funds')
export class AutoManageController {
    constructor(private readonly autoManageService: AutoManageService) { }

    @Get('list')
    @ApiOperation({ summary: 'Get investment-funds list with combined manager data' })
    @ApiResponse({
        status: 200,
        description: 'Return all managers with onchain and metadata combined.',
        type: [ManagerListResponseDto]
    })
    getManagerList() {
        return this.autoManageService.getManagerList();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get manager detail by ID' })
    @ApiParam({ name: 'id', description: 'Manager ID' })
    @ApiResponse({
        status: 200,
        description: 'Return manager detail with onchain and metadata combined.',
        type: ManagerListResponseDto
    })
    @ApiResponse({
        status: 404,
        description: 'Manager not found'
    })
    async getManagerById(@Param('id') id: string) {
        const manager = await this.autoManageService.getManagerById(id);
        if (!manager) {
            throw new NotFoundException(`Manager with ID ${id} not found`);
        }
        return manager;
    }
}

