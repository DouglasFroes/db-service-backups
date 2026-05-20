import { Injectable } from '@nestjs/common';
import { SqliteService } from '../../../providers/sqlite/sqlite.service';
import { DatabaseRow, toDto } from '../database.types';
import { DatabaseCreateDto } from './database-create.dto';

@Injectable()
export class DatabaseCreateService {
  constructor(private readonly sqlite: SqliteService) {}

  run(dto: DatabaseCreateDto) {
    const result = this.sqlite.db
      .prepare(
        `INSERT INTO database_connections (name, url, retention_days, active)
         VALUES (@name, @url, @retentionDays, @active)`,
      )
      .run({
        name: dto.name,
        url: dto.url,
        retentionDays: dto.retentionDays ?? 15,
        active: dto.active !== false ? 1 : 0,
      });
    const row = this.sqlite.db
      .prepare('SELECT * FROM database_connections WHERE id = ?')
      .get(result.lastInsertRowid) as DatabaseRow;
    return toDto(row);
  }
}
