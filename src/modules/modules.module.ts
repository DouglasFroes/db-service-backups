import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { BackupsModule } from './backups/backups.module';
import { DatabasesModule } from './databases/databases.module';

@Module({
  imports: [AuthModule, DatabasesModule, BackupsModule],
})
export class ModulesModule {}
