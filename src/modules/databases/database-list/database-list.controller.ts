import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/auth.guard';
import { DatabaseListService } from './database-list.service';

@UseGuards(JwtAuthGuard)
@Controller('databases')
export class DatabaseListController {
  constructor(private readonly service: DatabaseListService) {}

  @Get()
  run() {
    return this.service.run();
  }
}
