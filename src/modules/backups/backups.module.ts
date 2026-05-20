import { Module } from '@nestjs/common';
import { BackupDownloadModule } from './backup-download/backup-download.module';
import { BackupListModule } from './backup-list/backup-list.module';
import { BackupRunModule } from './backup-run/backup-run.module';
import { BackupSchedulerService } from './backup-scheduler.service';
import { BackupStatsModule } from './backup-stats/backup-stats.module';
import { BackupTriggerModule } from './backup-trigger/backup-trigger.module';

@Module({
  imports: [
    BackupRunModule,
    BackupTriggerModule,
    BackupListModule,
    BackupDownloadModule,
    BackupStatsModule,
  ],
  providers: [BackupSchedulerService],
})
export class BackupsModule {}
