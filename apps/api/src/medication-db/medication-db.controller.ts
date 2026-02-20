import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MedicationDbService } from './medication-db.service';
import { ParseUUIDPipe } from '../common/pipes/parse-uuid.pipe';

@ApiTags('medication-database')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('medication-db')
export class MedicationDbController {
  constructor(private readonly medDbService: MedicationDbService) {}

  @Get('search')
  @ApiOperation({ summary: 'Search medication reference database' })
  @ApiQuery({ name: 'q', required: true })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async search(
    @Query('q') query: string,
    @Query('limit') limit?: number,
  ) {
    return this.medDbService.search(query, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get medication detail from reference DB' })
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    return this.medDbService.getById(id);
  }

  @Get('category/:category')
  @ApiOperation({ summary: 'List medications by category' })
  async getByCategory(@Param('category') category: string) {
    return this.medDbService.getByCategory(category);
  }

  @Get('palliative')
  @ApiOperation({ summary: 'List palliative care medications' })
  async getPalliative() {
    return this.medDbService.getPalliativeMedications();
  }

  @Get('opioid-reference')
  @ApiOperation({ summary: 'Get opioid MEDD reference table' })
  async getOpioidReference() {
    return this.medDbService.getOpioidReference();
  }
}
