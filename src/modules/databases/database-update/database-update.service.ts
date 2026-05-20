import { Injectable, NotFoundException } from '@nestjs/common';
import { SqliteService } from '../../../providers/sqlite/sqlite.service';
import { DatabaseRow, toDto } from '../database.types';
import { DatabaseUpdateDto } from './database-update.dto';

@Injectable()
export class DatabaseUpdateService {
  constructor(private readonly sqlite: SqliteService) {}

  run(id: number, dto: DatabaseUpdateDto) {
    const existing = this.sqlite.db
      .prepare('SELECT * FROM database_connections WHERE id = ?')
      .get(id) as DatabaseRow | undefined;
    if (!existing) throw new NotFoundException(`Banco ${id} não encontrado`);

    this.sqlite.db
      .prepare(
        `UPDATE database_connections
         SET name = @name, url = @url, retention_days = @retentionDays,
             active = @active, updated_at = datetime('now')
         WHERE id = @id`,
      )
      .run({
        id,
        name: dto.name ?? existing.name,
        url: dto.url ?? existing.url,
        retentionDays: dto.retentionDays ?? existing.retention_days,
        active:
          dto.active !== undefined
            ? dto.active ? 1 : 0
            : existing.active,
      });

    return toDto(
      this.sqlite.db
        .prepare('SELECT * FROM database_connections WHERE id = ?')
        .get(id) as DatabaseRow,
    );
  }
}
