import { Injectable } from '@nestjs/common';
import { SqliteService } from '../../../providers/sqlite/sqlite.service';
import { BackupRow, toDto } from '../backup.types';

@Injectable()
export class BackupListService {
  constructor(private readonly sqlite: SqliteService) {}

  run(databaseId?: number) {
    let rows: BackupRow[];
    if (databaseId) {
      rows = this.sqlite.db
        .prepare(
          `SELECT * FROM backup_records WHERE database_id = ?
           ORDER BY created_at DESC LIMIT 200`,
        )
        .all(databaseId) as BackupRow[];
    } else {
      rows = this.sqlite.db
        .prepare(
          'SELECT * FROM backup_records ORDER BY created_at DESC LIMIT 200',
        )
        .all() as BackupRow[];
    }
    return rows.map(toDto);
  }
}
