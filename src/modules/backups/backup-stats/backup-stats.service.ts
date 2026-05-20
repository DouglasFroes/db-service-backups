import { Injectable } from '@nestjs/common';
import { SqliteService } from '../../../providers/sqlite/sqlite.service';

interface StatsRow {
  total: number;
  success: number;
  failed: number;
  totalSizeBytes: number;
}

interface LastBackupRow {
  created_at: string;
  name: string;
}

@Injectable()
export class BackupStatsService {
  constructor(private readonly sqlite: SqliteService) {}

  run() {
    const stats = this.sqlite.db
      .prepare(
        `SELECT
           COUNT(*) as total,
           SUM(CASE WHEN status = 'success' THEN 1 ELSE 0 END) as success,
           SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed,
           COALESCE(SUM(size_bytes), 0) as totalSizeBytes
         FROM backup_records`,
      )
      .get() as StatsRow;

    const lastBackup = this.sqlite.db
      .prepare(
        `SELECT br.created_at, dc.name
         FROM backup_records br
         JOIN database_connections dc ON dc.id = br.database_id
         WHERE br.status = 'success'
         ORDER BY br.created_at DESC
         LIMIT 1`,
      )
      .get() as LastBackupRow | undefined;

    return {
      total: stats.total,
      success: stats.success,
      failed: stats.failed,
      totalSizeBytes: stats.totalSizeBytes,
      lastBackupAt: lastBackup?.created_at ?? null,
      lastBackupDatabase: lastBackup?.name ?? null,
    };
  }
}
