import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/auth.guard';
import { BackupListService } from './backup-list.service';

@UseGuards(JwtAuthGuard)
@Controller('backups')
export class BackupListController {
  constructor(private readonly service: BackupListService) {}

  @Get()
  run(@Query('databaseId') databaseId?: string) {
    return this.service.run(databaseId ? Number(databaseId) : undefined);
  }
}
