import { Module } from '@nestjs/common';
import { StorageModule } from '../../../providers/storage/storage.module';
import { BackupRunService } from './backup-run.service';
import { BackupUploadService } from './backup-upload.service';

@Module({
  imports: [StorageModule],
  providers: [BackupRunService, BackupUploadService],
  exports: [BackupRunService],
})
export class BackupRunModule {}
