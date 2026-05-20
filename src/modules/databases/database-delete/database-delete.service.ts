import { Injectable, NotFoundException } from '@nestjs/common';
import { SqliteService } from '../../../providers/sqlite/sqlite.service';

@Injectable()
export class DatabaseDeleteService {
  constructor(private readonly sqlite: SqliteService) {}

  run(id: number) {
    const existing = this.sqlite.db
      .prepare('SELECT id FROM database_connections WHERE id = ?')
      .get(id);
    if (!existing) throw new NotFoundException(`Banco ${id} não encontrado`);
    this.sqlite.db
      .prepare('DELETE FROM database_connections WHERE id = ?')
      .run(id);
    return { message: 'Removido com sucesso' };
  }
}
