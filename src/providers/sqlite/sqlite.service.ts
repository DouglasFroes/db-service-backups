import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import Database from 'better-sqlite3';
import {
  createReadStream,
  createWriteStream,
  existsSync,
  mkdirSync,
  unlinkSync,
} from 'fs';
import { dirname } from 'path';
import type { Readable } from 'stream';
import { pipeline } from 'stream/promises';

@Injectable()
export class SqliteService implements OnModuleInit {
  private readonly logger = new Logger(SqliteService.name);
  db!: Database.Database;
  private dbPath!: string;

  async onModuleInit() {
    const path = process.env.DB_PATH || '/app/data/app.db';
    this.dbPath = path;
    mkdirSync(dirname(path), { recursive: true });

    const s3Key = process.env.DB_S3_KEY;
    if (s3Key && !existsSync(path)) {
      this.logger.log('DB local não encontrado — tentando restaurar do S3...');
      await this.restoreFromS3(s3Key).catch((err: Error) =>
        this.logger.warn(
          `Restauração do S3 falhou: ${err.message} — iniciando DB vazio`,
        ),
      );
    }

    this.db = new Database(path);
    this.db.pragma('journal_mode = WAL');
    this.db.pragma('foreign_keys = ON');
    this.runMigrations();
  }

  async backup(): Promise<void> {
    const s3Key = process.env.DB_S3_KEY;
    if (!s3Key) throw new Error('DB_S3_KEY não configurado no .env');

    const tempPath = this.dbPath + '.tmp';
    await this.db.backup(tempPath);
    try {
      await this.buildS3Client().send(
        new PutObjectCommand({
          Bucket: process.env.S3_BUCKET!,
          Key: s3Key,
          Body: createReadStream(tempPath),
        }),
      );
      this.logger.log(`DB enviado para S3: ${s3Key}`);
    } finally {
      unlinkSync(tempPath);
    }
  }

  private async restoreFromS3(s3Key: string): Promise<void> {
    const res = await this.buildS3Client().send(
      new GetObjectCommand({ Bucket: process.env.S3_BUCKET!, Key: s3Key }),
    );
    await pipeline(res.Body as Readable, createWriteStream(this.dbPath));
    this.logger.log(`DB restaurado do S3: ${s3Key}`);
  }

  private buildS3Client(): S3Client {
    const endpoint = process.env.S3_ENDPOINT;
    return new S3Client({
      ...(endpoint ? { endpoint } : {}),
      region: process.env.S3_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY!,
        secretAccessKey: process.env.S3_SECRET_KEY!,
      },
      forcePathStyle: !!endpoint,
    });
  }

  private runMigrations() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS database_connections (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        url TEXT NOT NULL,
        retention_days INTEGER NOT NULL DEFAULT 15,
        active INTEGER NOT NULL DEFAULT 1,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS backup_records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        database_id INTEGER NOT NULL REFERENCES database_connections(id) ON DELETE CASCADE,
        filename TEXT NOT NULL,
        minio_key TEXT,
        size_bytes INTEGER NOT NULL DEFAULT 0,
        status TEXT NOT NULL DEFAULT 'pending',
        error_message TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
    `);
  }
}
