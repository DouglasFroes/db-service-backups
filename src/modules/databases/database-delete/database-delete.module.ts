import { Module } from '@nestjs/common';
import { DatabaseDeleteController } from './database-delete.controller';
import { DatabaseDeleteService } from './database-delete.service';

@Module({
  controllers: [DatabaseDeleteController],
  providers: [DatabaseDeleteService],
})
export class DatabaseDeleteModule {}
