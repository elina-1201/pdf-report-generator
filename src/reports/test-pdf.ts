// src/reports/test-pdf.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { ReportsService } from './reports.service';

async function main(): Promise<void> {
    const app = await NestFactory.createApplicationContext(AppModule, {
        logger: false,
    });

    const reports = app.get(ReportsService);
    await reports.generatePdfReport();
    console.log('PDF written to output.pdf');

    await app.close();
}

main().catch((error) => {
    console.error('PDF test failed:', error);
    process.exit(1);
});
