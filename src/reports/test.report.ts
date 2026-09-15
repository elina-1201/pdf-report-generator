// src/reports/test-report.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { ReportsService } from './reports.service';

async function main(): Promise<void> {
    const app = await NestFactory.createApplicationContext(AppModule, {
        logger: false,
    });

    const reports = app.get(ReportsService);
    const data = await reports.getReportData();
    console.log(JSON.stringify(data, null, 2));

    await app.close();
}

main().catch((error) => {
    console.error('Report failed:', error);
    process.exit(1);
});