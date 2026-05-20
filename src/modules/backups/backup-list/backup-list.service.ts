import { Injectable } from '@nestjs/common';
import { SqliteService } from '../../../providers/sqlite/sqlite.service';
import { BackupRow, toDto } from '../backup.types';

type BackupRowWithDb = BackupRow & { database_name: string | null };

const BASE_QUERY = `
  SELECT br.*, dc.name AS database_name
  FROM backup_records br
  LEFT JOIN database_connections dc ON dc.id = br.database_id
`;

@Injectable()
export class BackupListService {
  constructor(private readonly sqlite: SqliteService) {}

  run(databaseId?: number) {
    let rows: BackupRowWithDb[];
    if (databaseId) {
      rows = this.sqlite.db
        .prepare(`${BASE_QUERY} WHERE br.database_id = ? ORDER BY br.created_at DESC LIMIT 200`)
        .all(databaseId) as BackupRowWithDb[];
    } else {
      rows = this.sqlite.db
        .prepare(`${BASE_QUERY} ORDER BY br.created_at DESC LIMIT 200`)
        .all() as BackupRowWithDb[];
    }
    return rows.map((r) => ({ ...toDto(r), databaseName: r.database_name }));
  }
}
