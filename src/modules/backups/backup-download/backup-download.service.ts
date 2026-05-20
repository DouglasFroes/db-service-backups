import { Injectable, NotFoundException } from '@nestjs/common';
import { Readable } from 'stream';
import { SqliteService } from '../../../providers/sqlite/sqlite.service';
import { StorageService } from '../../../providers/storage/storage.service';
import { BackupRow } from '../backup.types';

@Injectable()
export class BackupDownloadService {
  constructor(
    private readonly sqlite: SqliteService,
    private readonly storage: StorageService,
  ) {}

  async run(id: number): Promise<{ stream: Readable; filename: string }> {
    const record = this.sqlite.db
      .prepare('SELECT * FROM backup_records WHERE id = ?')
      .get(id) as BackupRow | undefined;
    if (!record) throw new NotFoundException(`Backup ${id} não encontrado`);
    if (!record.minio_key)
      throw new NotFoundException('Arquivo de backup sem chave de armazenamento');

    const stream = await this.storage.getStream(record.minio_key);
    return { stream, filename: record.filename };
  }
}
