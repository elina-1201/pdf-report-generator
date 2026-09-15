import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Handlebars from 'handlebars';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { chromium } from 'playwright';
import { Repository } from 'typeorm';
import { Book } from './book.entity';
import { ReportDTO } from './dto/report.dto';

@Injectable()
export class ReportsService {
    constructor(
        @InjectRepository(Book)
        private readonly bookRepository: Repository<Book>
    ) { }

    async getReportData() {
        const totalNumberOfBooks = await this.bookRepository.count();
        const averagePrice = await this.bookRepository.average('price').toFixed(2) ?? 0;

        const top5expensiveBooks = await this.bookRepository.find({
            order: { price: 'DESC' },
            take: 5,
        });

        const rows = await this.bookRepository
            .createQueryBuilder('book')
            .select('book.rating', 'rating')
            .addSelect('COUNT(*)', 'count')
            .groupBy('book.rating')
            .getRawMany();

        const booksPerRating = rows.map((row) => ({
            rating: Number(row.rating),
            count: Number(row.count),
        }));

        const reportData: ReportDTO = {
            totalNumberOfBooks,
            averagePrice,
            top5expensiveBooks: top5expensiveBooks,
            numOfBooksPerRating: booksPerRating,
        };

        return reportData;
    }

    async generatePdfReport() {
        const templateSource = readFileSync(join(__dirname, 'report.html'), 'utf-8');
        Handlebars.registerHelper('inc', (value: number) => Number(value) + 1);
        const template = Handlebars.compile(templateSource);

        const reportData = await this.getReportData();
        const allBooks = await this.bookRepository.find({ order: { price: 'DESC' } });

        const sumTop5Prices = reportData.top5expensiveBooks
            .reduce((sum, book) => sum + Number(book.price), 0)
            .toFixed(2);
        const sumAllPrices = allBooks
            .reduce((sum, book) => sum + Number(book.price), 0)
            .toFixed(2);

        const html = template({
            ...reportData,
            allBooks,
            sumTop5Prices,
            sumAllPrices,
            today: new Date().toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            }),
        });
        async function htmlToPdf(html) {
            const browser = await chromium.launch();
            const page = await browser.newPage();

            await page.setContent(html, { waitUntil: 'networkidle' });

            const pdf = await page.pdf({
                format: 'A4',
                margin: { top: '10mm', bottom: '10mm', left: '10mm', right: '10mm' },
                printBackground: true,
            });

            await browser.close();
            return pdf;
        }

        const pdf = await htmlToPdf(html);
        writeFileSync('output.pdf', pdf);
    }
}
