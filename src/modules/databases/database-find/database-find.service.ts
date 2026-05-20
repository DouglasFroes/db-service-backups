import { Injectable, NotFoundException } from '@nestjs/common';
import { SqliteService } from '../../../providers/sqlite/sqlite.service';
import { DatabaseRow, toDto } from '../database.types';

interface BackupStatsRow {
  total: number;
  success: number;
  failed: number;
  totalSizeBytes: number | null;
  lastBackupAt: string | null;
}

interface BackupRow {
  id: number;
  filename: string;
  size_bytes: number;
  status: string;
  error_message: string | null;
  created_at: string;
}

@Injectable()
export class DatabaseFindService {
  constructor(private readonly sqlite: SqliteService) {}

  run(id: number) {
    const row = this.sqlite.db
      .prepare('SELECT * FROM database_connections WHERE id = ?')
      .get(id) as DatabaseRow | undefined;
    if (!row) throw new NotFoundException(`Banco ${id} não encontrado`);

    const stats = this.sqlite.db
      .prepare(
        `SELECT
           COUNT(*)                                                   AS total,
           SUM(CASE WHEN status = 'success' THEN 1 ELSE 0 END)       AS success,
           SUM(CASE WHEN status = 'failed'  THEN 1 ELSE 0 END)       AS failed,
           SUM(size_bytes)                                            AS totalSizeBytes,
           MAX(CASE WHEN status = 'success' THEN created_at END)     AS lastBackupAt
         FROM backup_records
         WHERE database_id = ?`,
      )
      .get(id) as BackupStatsRow;

    const recentBackups = (
      this.sqlite.db
        .prepare(
          `SELECT id, filename, size_bytes, status, error_message, created_at
           FROM backup_records
           WHERE database_id = ?
           ORDER BY created_at DESC
           LIMIT 10`,
        )
        .all(id) as BackupRow[]
    ).map((b) => ({
      id: b.id,
      filename: b.filename,
      sizeBytes: b.size_bytes,
      status: b.status,
      errorMessage: b.error_message,
      createdAt: b.created_at,
    }));

    return {
      ...toDto(row),
      stats: {
        total: stats.total,
        success: stats.success ?? 0,
        failed: stats.failed ?? 0,
        totalSizeBytes: stats.totalSizeBytes ?? 0,
        lastBackupAt: stats.lastBackupAt,
      },
      recentBackups,
    };
  }
}
