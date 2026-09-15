import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
        const averagePrice = await this.bookRepository.average('price') ?? 0;

        const top5expensiveBooks = await this.bookRepository.find({
            order: { price: 'DESC' },
            take: 5,
        });

        const top5expensiveBooksTitles = top5expensiveBooks.map(book => book.title);

        const rows = await this.bookRepository
            .createQueryBuilder('book')
            .select('book.rating', 'rating')
            .addSelect('COUNT(*)', 'count')
            .groupBy('book.rating')
            .getRawMany();

        const reportData: ReportDTO = {
            totalNumberOfBooks,
            averagePrice,
            top5expensiveTitles: top5expensiveBooksTitles,
            numOfBooksPerRating: rows
        };

        // console.log(reportData);
        return reportData;
    }
}
