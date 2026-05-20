import { Module } from '@nestjs/common';
import { BackupRunModule } from '../backup-run/backup-run.module';
import { BackupTriggerController } from './backup-trigger.controller';
import { BackupTriggerService } from './backup-trigger.service';

@Module({
  imports: [BackupRunModule],
  controllers: [BackupTriggerController],
  providers: [BackupTriggerService],
})
export class BackupTriggerModule {}
