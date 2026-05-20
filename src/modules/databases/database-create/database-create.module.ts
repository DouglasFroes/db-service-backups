import { Module } from '@nestjs/common';
import { DatabaseCreateController } from './database-create.controller';
import { DatabaseCreateService } from './database-create.service';

@Module({
  controllers: [DatabaseCreateController],
  providers: [DatabaseCreateService],
})
export class DatabaseCreateModule {}
