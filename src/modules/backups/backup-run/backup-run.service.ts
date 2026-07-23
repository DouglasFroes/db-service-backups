import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { SqliteService } from '../../../providers/sqlite/sqlite.service';
import { StorageService } from '../../../providers/storage/storage.service';
import { BackupUploadService } from './backup-upload.service';

function sanitizeFolderName(name: string): string {
  return name.trim().replace(/[^a-zA-Z0-9._-]+/g, '_');
}

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
    private readonly storage: StorageService,
  ) {}

  async runAll(): Promise<{ ran: number; failed: number }> {
    const databases = this.sqlite.db
      .prepare(
        'SELECT id, name, url FROM database_connections WHERE active = 1',
      )
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

  async runById(databaseId: number): Promise<{ ran: number; failed: number }> {
    const db = this.sqlite.db
      .prepare(
        'SELECT id, name, url FROM database_connections WHERE id = ? AND active = 1',
      )
      .get(databaseId) as DatabaseRow | undefined;
    if (!db) {
      throw new NotFoundException(
        `Conexão de banco de dados ${databaseId} não encontrada ou inativa`,
      );
    }
    const ok = await this.runOne(db);
    return ok ? { ran: 1, failed: 0 } : { ran: 0, failed: 1 };
  }

  async runOne(db: DatabaseRow): Promise<boolean> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${timestamp}.sql`;
    const storageKey = `${sanitizeFolderName(db.name)}/${filename}`;

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
      await this.cleanOldBackups(db.id);
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

  private async cleanOldBackups(databaseId: number) {
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
      if (record.minio_key) {
        try {
          await this.storage.deleteFile(record.minio_key);
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          this.logger.warn(
            `Falha ao excluir arquivo de backup ${record.minio_key} do storage: ${msg}`,
          );
          continue;
        }
      }
      this.sqlite.db
        .prepare('DELETE FROM backup_records WHERE id = ?')
        .run(record.id);
    }
  }
}
