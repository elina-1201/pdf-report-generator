import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from '../database/entities/book.entity';
import { Report } from '../database/entities/report.entity';
import { PdfRendererService } from './pdf-renderer.service';
import { ReportDataService } from './report-data.service';
import { ReportStorageService } from './report-storage.service';
import { ReportTemplateService } from './report-template.service';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';

@Module({
    imports: [TypeOrmModule.forFeature([Book, Report])],
    providers: [ReportsService, PdfRendererService, ReportDataService, ReportStorageService, ReportTemplateService],
    controllers: [ReportsController],
})
export class ReportsModule { }
