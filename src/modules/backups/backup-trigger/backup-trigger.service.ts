import { Injectable } from '@nestjs/common';
import { BackupRunService } from '../backup-run/backup-run.service';

@Injectable()
export class BackupTriggerService {
  constructor(private readonly backupRun: BackupRunService) {}

  run(databaseId?: number) {
    if (databaseId) {
      return this.backupRun.runById(databaseId);
    }
    return this.backupRun.runAll();
  }
}
