export interface DatabaseRow {
  id: number;
  name: string;
  url: string;
  retention_days: number;
  active: number;
  created_at: string;
  updated_at: string;
}

export interface DatabaseDto {
  id: number;
  name: string;
  url: string;
  retentionDays: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export function toDto(row: DatabaseRow): DatabaseDto {
  return {
    id: row.id,
    name: row.name,
    url: row.url,
    retentionDays: row.retention_days,
    active: row.active === 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
