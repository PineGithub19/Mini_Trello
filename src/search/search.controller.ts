import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { SearchService } from './search.service';
import { Roles } from 'src/auth/decorators/roles/roles.decorator';
import { UserRole } from 'src/auth/enums/role.enum';
import { RolesGuard } from 'src/auth/guards/roles/roles.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Search')
@ApiBearerAuth()
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) { }

  @Get()
  @Roles(UserRole.USER)
  @UseGuards(RolesGuard)
  async search(@Query('text') text: string) {
    return this.searchService.search(text);
  }
}
