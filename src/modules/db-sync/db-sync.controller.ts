import { Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/auth.guard';
import { DbSyncService } from './db-sync.service';

@UseGuards(JwtAuthGuard)
@Controller('db')
export class DbSyncController {
  constructor(private readonly service: DbSyncService) {}

  @Post('backup')
  run() {
    return this.service.run();
  }
}
