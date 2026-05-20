import { Module } from '@nestjs/common';
import { DatabaseUpdateController } from './database-update.controller';
import { DatabaseUpdateService } from './database-update.service';

@Module({
  controllers: [DatabaseUpdateController],
  providers: [DatabaseUpdateService],
})
export class DatabaseUpdateModule {}
