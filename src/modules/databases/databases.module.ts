import { Module } from '@nestjs/common';
import { DatabaseCreateModule } from './database-create/database-create.module';
import { DatabaseDeleteModule } from './database-delete/database-delete.module';
import { DatabaseFindModule } from './database-find/database-find.module';
import { DatabaseListModule } from './database-list/database-list.module';
import { DatabaseUpdateModule } from './database-update/database-update.module';

@Module({
  imports: [
    DatabaseCreateModule,
    DatabaseFindModule,
    DatabaseListModule,
    DatabaseUpdateModule,
    DatabaseDeleteModule,
  ],
})
export class DatabasesModule {}
