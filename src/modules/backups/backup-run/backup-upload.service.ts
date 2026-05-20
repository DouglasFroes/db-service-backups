import { Injectable, Logger } from '@nestjs/common';
import { spawn } from 'child_process';
import { PassThrough } from 'stream';
import { StorageService } from '../../../providers/storage/storage.service';

@Injectable()
export class BackupUploadService {
  private readonly logger = new Logger(BackupUploadService.name);

  constructor(private readonly storageService: StorageService) {}

  run(dbUrl: string, storageKey: string): Promise<number> {
    return new Promise((resolve, reject) => {
      let settled = false;
      const fail = (err: Error) => {
        if (!settled) {
          settled = true;
          reject(err);
        }
      };

      const child = spawn('pg_dump', [dbUrl]);
      let sizeBytes = 0;

      const counter = new PassThrough();
      counter.on('data', (chunk: Buffer) => {
        sizeBytes += chunk.length;
      });

      child.stderr.on('data', (d: Buffer) =>
        this.logger.warn(`pg_dump stderr: ${d.toString().trim()}`),
      );

      child.on('error', (err) => {
        counter.destroy();
        const code = (err as NodeJS.ErrnoException).code;
        fail(
          new Error(
            code === 'ENOENT'
              ? 'pg_dump não encontrado — instale postgresql-client no servidor'
              : `Falha ao iniciar pg_dump: ${err.message}`,
          ),
        );
      });

      child.on('close', (code) => {
        if (code !== 0) {
          counter.destroy();
          fail(new Error(`pg_dump encerrou com código ${code}`));
        }
      });

      child.stdout.pipe(counter);

      this.storageService
        .uploadStream(storageKey, counter)
        .then(() => {
          if (!settled) {
            settled = true;
            resolve(sizeBytes);
          }
        })
        .catch(fail);
    });
  }
}
