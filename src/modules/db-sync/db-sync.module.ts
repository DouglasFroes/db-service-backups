import { Module } from '@nestjs/common';
import { DbSyncController } from './db-sync.controller';
import { DbSyncService } from './db-sync.service';

@Module({
  controllers: [DbSyncController],
  providers: [DbSyncService],
})
export class DbSyncModule {}
