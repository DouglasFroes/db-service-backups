import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/auth.guard';
import { BackupTriggerService } from './backup-trigger.service';

@UseGuards(JwtAuthGuard)
@Controller('backups')
export class BackupTriggerController {
  constructor(private readonly service: BackupTriggerService) {}

  @Post('run')
  run(@Body('databaseId') databaseId?: number) {
    return this.service.run(databaseId);
  }
}
