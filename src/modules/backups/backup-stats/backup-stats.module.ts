import { Module } from '@nestjs/common';
import { BackupStatsController } from './backup-stats.controller';
import { BackupStatsService } from './backup-stats.service';

@Module({
  controllers: [BackupStatsController],
  providers: [BackupStatsService],
})
export class BackupStatsModule {}
