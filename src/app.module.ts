import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './service/database.module';
import { ReportsService } from './reports/reports.service';

@Module({
  imports: [DatabaseModule],
  controllers: [AppController],
  providers: [AppService, ReportsService],
})
export class AppModule { }
