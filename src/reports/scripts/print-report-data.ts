// Prints the aggregated report data as JSON. Usage: pnpm report:data
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { ReportDataService } from '../report-data.service';

async function main(): Promise<void> {
    const app = await NestFactory.createApplicationContext(AppModule, {
        logger: false,
    });

    const reportDataService = app.get(ReportDataService);
    const data = await reportDataService.getReportData();
    console.log(JSON.stringify(data, null, 2));

    await app.close();
}

main().catch((error) => {
    console.error('Report failed:', error);
    process.exit(1);
});