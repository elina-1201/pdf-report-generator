import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [DatabaseModule, ReportsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
