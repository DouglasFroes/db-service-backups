export interface BackupRow {
  id: number;
  database_id: number;
  filename: string;
  minio_key: string | null;
  size_bytes: number;
  status: string;
  error_message: string | null;
  created_at: string;
}

export interface BackupDto {
  id: number;
  databaseId: number;
  filename: string;
  minioKey: string | null;
  sizeBytes: number;
  status: string;
  errorMessage: string | null;
  createdAt: string;
}

export function toDto(row: BackupRow): BackupDto {
  return {
    id: row.id,
    databaseId: row.database_id,
    filename: row.filename,
    minioKey: row.minio_key,
    sizeBytes: row.size_bytes,
    status: row.status,
    errorMessage: row.error_message,
    createdAt: row.created_at,
  };
}
