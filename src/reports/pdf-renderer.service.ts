import { Injectable } from '@nestjs/common';
import { chromium } from 'playwright';

@Injectable()
export class PdfRendererService {
    async render(html: string): Promise<Buffer> {
        const browser = await chromium.launch();

        try {
            const page = await browser.newPage();

            await page.setContent(html, { waitUntil: 'networkidle' });

            return await page.pdf({
                format: 'A4',
                margin: { top: '10mm', bottom: '10mm', left: '10mm', right: '10mm' },
                printBackground: true,
            });
        } finally {
            await browser.close();
        }
    }
}
