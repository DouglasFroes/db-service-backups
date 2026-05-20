import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ModulesModule } from './modules/modules.module';
import { SqliteModule } from './providers/sqlite/sqlite.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      exclude: ['/api/{*path}'],
    }),
    ScheduleModule.forRoot(),
    SqliteModule,
    ModulesModule,
  ],
})
export class AppModule {}
