// Renders the report to reports/sample.pdf without inserting a row.
// Usage: pnpm report:pdf
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { ReportDataService } from '../report-data.service';
import { ReportsService } from '../reports.service';

async function main(): Promise<void> {
    const app = await NestFactory.createApplicationContext(AppModule, {
        logger: false,
    });

    const reports = app.get(ReportsService);
    const reportDataService = app.get(ReportDataService);

    await reports.generatePdfReport(await reportDataService.getReportData(), 'sample');
    console.log('PDF written to reports/sample.pdf');

    await app.close();
}

main().catch((error) => {
    console.error('PDF render failed:', error);
    process.exit(1);
});
