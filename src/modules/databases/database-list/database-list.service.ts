import { Injectable } from '@nestjs/common';
import { SqliteService } from '../../../providers/sqlite/sqlite.service';
import { DatabaseRow, toDto } from '../database.types';

@Injectable()
export class DatabaseListService {
  constructor(private readonly sqlite: SqliteService) {}

  run() {
    const rows = this.sqlite.db
      .prepare('SELECT * FROM database_connections ORDER BY created_at DESC')
      .all() as DatabaseRow[];
    return rows.map(toDto);
  }
}
