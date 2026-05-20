import { Injectable, Logger } from '@nestjs/common';
import { SqliteService } from '../../../providers/sqlite/sqlite.service';
import { BackupUploadService } from './backup-upload.service';

interface DatabaseRow {
  id: number;
  name: string;
  url: string;
}

@Injectable()
export class BackupRunService {
  private readonly logger = new Logger(BackupRunService.name);

  constructor(
    private readonly sqlite: SqliteService,
    private readonly backupUpload: BackupUploadService,
  ) {}

  async runAll(): Promise<{ ran: number; failed: number }> {
    const databases = this.sqlite.db
      .prepare('SELECT id, name, url FROM database_connections WHERE active = 1')
      .all() as DatabaseRow[];
    let ran = 0;
    let failed = 0;
    for (const db of databases) {
      const ok = await this.runOne(db);
      if (ok) {
        ran++;
      } else {
        failed++;
      }
    }
    return { ran, failed };
  }

  async runOne(db: DatabaseRow): Promise<boolean> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${timestamp}.sql`;
    const storageKey = `${db.id}/${filename}`;

    const { lastInsertRowid } = this.sqlite.db
      .prepare(
        `INSERT INTO backup_records (database_id, filename, minio_key, status)
         VALUES (?, ?, ?, 'pending')`,
      )
      .run(db.id, filename, storageKey);
    const recordId = Number(lastInsertRowid);

    try {
      const sizeBytes = await this.backupUpload.run(db.url, storageKey);
      this.sqlite.db
        .prepare(
          `UPDATE backup_records SET status = 'success', size_bytes = ? WHERE id = ?`,
        )
        .run(sizeBytes, recordId);
      this.cleanOldBackups(db.id);
      this.logger.log(`Backup concluído: ${db.name} → ${filename}`);
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      this.sqlite.db
        .prepare(
          `UPDATE backup_records SET status = 'failed', error_message = ? WHERE id = ?`,
        )
        .run(msg.slice(0, 500), recordId);
      this.logger.error(`Backup falhou para ${db.name}: ${msg}`);
      return false;
    }
  }

  private cleanOldBackups(databaseId: number) {
    const db = this.sqlite.db
      .prepare('SELECT retention_days FROM database_connections WHERE id = ?')
      .get(databaseId) as { retention_days: number } | undefined;
    if (!db) return;

    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - db.retention_days);
    const cutoffStr = cutoff.toISOString();

    const old = this.sqlite.db
      .prepare(
        `SELECT id, minio_key FROM backup_records
         WHERE database_id = ? AND status = 'success' AND created_at < ?`,
      )
      .all(databaseId, cutoffStr) as { id: number; minio_key: string | null }[];

    for (const record of old) {
      this.sqlite.db
        .prepare('DELETE FROM backup_records WHERE id = ?')
        .run(record.id);
    }
  }
}
