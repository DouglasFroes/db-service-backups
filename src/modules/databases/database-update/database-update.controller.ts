import { Body, Controller, Param, ParseIntPipe, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/auth.guard';
import { DatabaseUpdateDto } from './database-update.dto';
import { DatabaseUpdateService } from './database-update.service';

@UseGuards(JwtAuthGuard)
@Controller('databases')
export class DatabaseUpdateController {
  constructor(private readonly service: DatabaseUpdateService) {}

  @Put(':id')
  run(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: DatabaseUpdateDto,
  ) {
    return this.service.run(id, dto);
  }
}
