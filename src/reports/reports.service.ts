import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'node:crypto';
import { Repository } from 'typeorm';
import { Report } from '../database/entities/report.entity';
import { PdfRendererService } from './pdf-renderer.service';
import { ReportDataService } from './report-data.service';
import { ReportStorageService } from './report-storage.service';
import { ReportTemplateService } from './report-template.service';
import { ReportView } from './report-view.model';

@Injectable()
export class ReportsService {
    constructor(
        @InjectRepository(Report)
        private readonly reportRepository: Repository<Report>,
        private readonly reportData: ReportDataService,
        private readonly pdfRenderer: PdfRendererService,
        private readonly storage: ReportStorageService,
        private readonly reportTemplate: ReportTemplateService,
    ) { }

    async createReport(body: { force?: boolean } = {}): Promise<{ created: boolean, report: Report }> {
        const existingReport = await this.todaysReport();
        if (existingReport && !body.force) {
            return { created: false, report: existingReport };
        }

        const id = randomUUID();

        const data = await this.reportData.getReportData();

        try {
            await this.generatePdfReport(data, id);

            return {
                created: true,
                report: await this.reportRepository.save(
                    this.reportRepository.create({
                        id,
                        path: this.storage.storedPath(id),
                        createdAt: Date.now(),
                    }),
                )
            };
        } catch (error) {
            await this.storage.remove(id);
            throw error;
        }
    }

    async generatePdfReport(reportData: ReportView, reportId: string): Promise<void> {
        const html = this.reportTemplate.render(reportData);
        const pdf = await this.pdfRenderer.render(html);
        await this.storage.write(reportId, pdf);
    }


    async getReportById(reportId: string): Promise<Report> {
        const report = await this.reportRepository.findOneBy({ id: reportId });
        if (!report) {
            throw new NotFoundException(`Report with ID ${reportId} not found`);
        }
        return report;
    }

    private async todaysReport(): Promise<Report | null> {
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const todaysReport = await this.reportRepository
            .createQueryBuilder('report')
            .where('report.createdAt >= :start', { start: startOfToday.getTime() })
            .getOne();

        return todaysReport;
    }
}
