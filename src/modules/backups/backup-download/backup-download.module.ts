import { Module } from '@nestjs/common';
import { StorageModule } from '../../../providers/storage/storage.module';
import { BackupDownloadController } from './backup-download.controller';
import { BackupDownloadService } from './backup-download.service';

@Module({
  imports: [StorageModule],
  controllers: [BackupDownloadController],
  providers: [BackupDownloadService],
})
export class BackupDownloadModule {}
