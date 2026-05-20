import { Module } from '@nestjs/common';
import { DatabaseListController } from './database-list.controller';
import { DatabaseListService } from './database-list.service';

@Module({
  controllers: [DatabaseListController],
  providers: [DatabaseListService],
})
export class DatabaseListModule {}
