import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { BackupRunService } from './backup-run/backup-run.service';

@Injectable()
export class BackupSchedulerService implements OnModuleInit {
  private readonly logger = new Logger(BackupSchedulerService.name);

  constructor(
    private readonly backupRun: BackupRunService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  onModuleInit() {
    const time = process.env.BACKUP_TIME || '02:00';
    const [hour, minute] = time.split(':');
    const cron = `${minute ?? '0'} ${hour ?? '2'} * * *`;

    const job = new CronJob(cron, async () => {
      this.logger.log('Iniciando backup diário...');
      const result = await this.backupRun.runAll();
      this.logger.log(
        `Backup diário concluído: ${result.ran} ok, ${result.failed} falhas`,
      );
    });

    this.schedulerRegistry.addCronJob('daily-backup', job);
    job.start();
    this.logger.log(`Backup agendado para ${time} (cron: ${cron})`);
  }
}
