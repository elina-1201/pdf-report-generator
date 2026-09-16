import { Controller, Get, NotFoundException, Param, Post, StreamableFile } from '@nestjs/common';
import { ReportSummaryDTO } from './dto/report.dto';
import { ReportStorageService } from './report-storage.service';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
    constructor(
        private readonly reportsService: ReportsService,
        private readonly storage: ReportStorageService,
    ) { }

    @Post()
    async generateReport(): Promise<ReportSummaryDTO> {
        const report = await this.reportsService.createReport();
        return ReportSummaryDTO.from(report.id);
    }

    @Get(':id')
    async getReportById(@Param('id') id: string): Promise<ReportSummaryDTO> {
        const report = await this.reportsService.getReportById(id);
        return ReportSummaryDTO.from(report.id);
    }


    @Get(':id/file')
    async getReportFile(@Param('id') id: string): Promise<StreamableFile> {
        await this.reportsService.getReportById(id);

        if (!this.storage.exists(id)) {
            throw new NotFoundException(`PDF for report ${id} not found on disk`);
        }

        return new StreamableFile(this.storage.createReadStream(id), { type: 'application/pdf' });
    }

}
