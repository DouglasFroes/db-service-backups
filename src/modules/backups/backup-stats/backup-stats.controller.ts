import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/auth.guard';
import { BackupStatsService } from './backup-stats.service';

@UseGuards(JwtAuthGuard)
@Controller('backups')
export class BackupStatsController {
  constructor(private readonly service: BackupStatsService) {}

  @Get('stats')
  run() {
    return this.service.run();
  }
}
