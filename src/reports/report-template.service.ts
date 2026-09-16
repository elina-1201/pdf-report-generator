import { Injectable } from '@nestjs/common';
import Handlebars from 'handlebars';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ReportBookRow, ReportView } from './report-view.model';

/**
 * The view layer: turns report data into the HTML that gets printed to PDF.
 *
 * Owns the Handlebars instance, the template source, and the values that exist
 * only because the template needs them (row totals, the rendered date).
 *
 * Template loading is lazy on purpose: the file is read on first render rather
 * than at construction, so instantiating this service never touches disk and
 * callers can be tested with a stub.
 */
@Injectable()
export class ReportTemplateService {
    private template?: Handlebars.TemplateDelegate;

    render(reportData: ReportView): string {
        return this.getTemplate()({
            ...reportData,
            sumTop5Prices: this.sum(reportData.top5expensiveBooks),
            sumAllPrices: this.sum(reportData.allBooks),
            today: new Date().toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            }),
        });
    }

    private sum(books: ReportBookRow[]): string {
        return books.reduce((total, book) => total + Number(book.price), 0).toFixed(2);
    }

    private getTemplate(): Handlebars.TemplateDelegate {
        if (!this.template) {
            // Isolated instance: registering helpers on the global Handlebars
            // singleton leaks state between templates/renders.
            const handlebars = Handlebars.create();

            const source = readFileSync(join(__dirname, 'templates', 'report.html'), 'utf-8');
            this.template = handlebars.compile(source);
        }

        return this.template;
    }
}
