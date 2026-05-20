import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { JwtAuthGuard } from '../../auth/auth.guard';
import { BackupDownloadService } from './backup-download.service';

@UseGuards(JwtAuthGuard)
@Controller('backups')
export class BackupDownloadController {
  constructor(private readonly service: BackupDownloadService) {}

  @Get(':id/download')
  async run(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const { stream, filename } = await this.service.run(id);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'application/octet-stream');
    stream.pipe(res);
  }
}
