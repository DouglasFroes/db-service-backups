import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/auth.guard';
import { DatabaseFindService } from './database-find.service';

@UseGuards(JwtAuthGuard)
@Controller('databases')
export class DatabaseFindController {
  constructor(private readonly service: DatabaseFindService) {}

  @Get(':id')
  run(@Param('id', ParseIntPipe) id: number) {
    return this.service.run(id);
  }
}
