export class ReportDTO {
    totalNumberOfBooks!: number;
    averagePrice!: number;
    top5expensiveTitles!: string[];
    numOfBooksPerRating!: Map<string, number>[];
}