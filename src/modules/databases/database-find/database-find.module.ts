import { Module } from '@nestjs/common';
import { DatabaseFindController } from './database-find.controller';
import { DatabaseFindService } from './database-find.service';

@Module({
  controllers: [DatabaseFindController],
  providers: [DatabaseFindService],
})
export class DatabaseFindModule {}
