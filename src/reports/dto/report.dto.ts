import { Book } from "../book.entity";

export class ReportDTO {
    totalNumberOfBooks!: number;
    averagePrice!: number;
    top5expensiveBooks!: Book[];
    numOfBooksPerRating!: { rating: number; count: number }[];
}