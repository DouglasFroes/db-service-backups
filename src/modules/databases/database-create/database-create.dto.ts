import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class DatabaseCreateDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  url: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  retentionDays?: number;

  @IsBoolean()
  @IsOptional()
  active?: boolean;
}
