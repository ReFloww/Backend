import { Controller, Get } from '@nestjs/common';
import { AutoManageService } from './auto-manage.service';
import { ManagerListResponseDto } from './dto/manager-list-response.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Auto-Manage')
@Controller('auto-manage')
export class AutoManageController {
    constructor(private readonly autoManageService: AutoManageService) { }

    @Get('list')
    @ApiOperation({ summary: 'Get auto-manage list with combined manager data' })
    @ApiResponse({
        status: 200,
        description: 'Return all managers with onchain and metadata combined.',
        type: [ManagerListResponseDto]
    })
    getManagerList() {
        return this.autoManageService.getManagerList();
    }
}
