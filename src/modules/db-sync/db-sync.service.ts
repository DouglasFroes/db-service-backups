import { Injectable } from '@nestjs/common';
import { SqliteService } from '../../providers/sqlite/sqlite.service';

@Injectable()
export class DbSyncService {
  constructor(private readonly sqlite: SqliteService) {}

  async run() {
    await this.sqlite.backup();
    return { message: 'DB enviado para o S3 com sucesso' };
  }
}
