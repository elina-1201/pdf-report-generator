import { Body, Controller, Get, NotFoundException, Param, Post, Res, StreamableFile } from '@nestjs/common';
import type { Response } from 'express';
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
    async generateReport(
        @Res({ passthrough: true }) response: Response,
        @Body() body: { force: boolean }
    ): Promise<ReportSummaryDTO> {
        const { created, report } = (await this.reportsService.createReport(body));
        response.status(created ? 201 : 200);
        return ReportSummaryDTO.from(report.id);
    }

    @Get(':id')
    async getReportById(@Param('id') id: string): Promise<ReportSummaryDTO> {
        const report = await this.reportsService.getReportById(id);
        return ReportSummaryDTO.from(report.id);
    }


    @Get(':id/file')
    async getReportFile(@Param('id') id: string): Promise<StreamableFile> {
        void (await this.reportsService.getReportById(id));

        if (!this.storage.exists(id)) {
            throw new NotFoundException(`PDF for report ${id} not found on disk`);
        }

        return new StreamableFile(this.storage.createReadStream(id), {
            type: 'application/pdf',
            disposition: `attachment; filename="report-${id}.pdf"`,
        });
    }

}
