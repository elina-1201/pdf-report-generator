import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from '../database/entities/book.entity';
import { ReportBookRow, ReportView } from './report-view.model';

/**
 * The read model: every SQL query the report needs lives here, and nowhere else.
 *
 * Aggregation is done in the database on purpose — ORDER BY price DESC LIMIT 5
 * for the top five, AVG(price) for the average, GROUP BY rating with COUNT(*)
 * for the per-rating breakdown. `ReportsService` never touches a repository.
 */
@Injectable()
export class ReportDataService {
    constructor(
        @InjectRepository(Book)
        private readonly bookRepository: Repository<Book>,
    ) { }

    async getReportData(): Promise<ReportView> {
        const allBooks = await this.bookRepository.find({ order: { price: 'DESC' } });
        const totalNumberOfBooks = allBooks.length;
        const averagePrice = await this.bookRepository.average('price') ?? 0;

        const top5expensiveBooks = await this.bookRepository.find({
            order: { price: 'DESC' },
            take: 5,
        });

        const rows = await this.bookRepository
            .createQueryBuilder('book')
            .select('book.rating', 'rating')
            .addSelect('COUNT(*)', 'count')
            .groupBy('book.rating')
            .orderBy('book.rating', 'DESC')
            .getRawMany();

        const booksPerRating = rows.map((row) => ({
            rating: Number(row.rating),
            count: Number(row.count),
        }));

        return {
            totalNumberOfBooks,
            averagePrice: Number(averagePrice.toFixed(2)),
            top5expensiveBooks: top5expensiveBooks.map((book, index) => ReportBookRow.from(book, index + 1)),
            numOfBooksPerRating: booksPerRating,
            allBooks: allBooks.map((book, index) => ReportBookRow.from(book, index + 1)),
        };
    }
}
