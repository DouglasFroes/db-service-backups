import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class DatabaseUpdateDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  url?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  retentionDays?: number;

  @IsBoolean()
  @IsOptional()
  active?: boolean;
}
