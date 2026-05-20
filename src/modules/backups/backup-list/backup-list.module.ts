import { Module } from '@nestjs/common';
import { BackupListController } from './backup-list.controller';
import { BackupListService } from './backup-list.service';

@Module({
  controllers: [BackupListController],
  providers: [BackupListService],
})
export class BackupListModule {}
