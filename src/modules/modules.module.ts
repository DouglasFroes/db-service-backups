import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { BackupsModule } from './backups/backups.module';
import { DatabasesModule } from './databases/databases.module';
import { DbSyncModule } from './db-sync/db-sync.module';

@Module({
  imports: [AuthModule, DatabasesModule, BackupsModule, DbSyncModule],
})
export class ModulesModule {}
