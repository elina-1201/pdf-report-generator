import { Book } from '../database/entities/book.entity';

/**
 * The template's view model: exactly the fields `report.html` renders.
 *
 * The field list — not the `Book` entity — is the template's contract, so a
 * Book gaining or losing a column cannot silently change what the template
 * receives. `from` is the single place that maps between the two, and `rank`
 * arrives already resolved so the template never has to do arithmetic.
 */
export class ReportBookRow {
    rank!: number;
    title!: string;
    rating!: number;
    price!: number;

    static from(book: Book, rank: number): ReportBookRow {
        return {
            rank,
            title: book.title,
            rating: book.rating,
            price: book.price,
        };
    }
}

export interface RatingCount {
    rating: number;
    count: number;
}

export interface ReportView {
    totalNumberOfBooks: number;
    averagePrice: number;
    top5expensiveBooks: ReportBookRow[];
    numOfBooksPerRating: RatingCount[];
    allBooks: ReportBookRow[];
}
