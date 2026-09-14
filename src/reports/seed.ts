import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import process from 'node:process';
import { DataSource } from 'typeorm';
import { Book } from './book.entity';

interface BookJson {
    title: string;
    product_url: string;
    price_gbp: number;
    rating: number;
}

async function seed(): Promise<void> {
    const dataSource = new DataSource({
        type: 'better-sqlite3',
        database: join(process.cwd(), 'report.db'),
        entities: [Book],
        synchronize: true,
    });

    await dataSource.initialize();

    try {
        const repository = dataSource.getRepository(Book);

        // Drop all existing records.
        await repository.clear();

        const raw = readFileSync(join(__dirname, 'books.json'), 'utf-8');
        const records = JSON.parse(raw) as BookJson[];

        const books = records.map((record) =>
            repository.create({
                title: record.title,
                price: record.price_gbp,
                rating: record.rating,
                url: record.product_url,
            }),
        );

        await repository.save(books);
        console.log(`Seeded ${books.length} books into report.db`);
    } finally {
        await dataSource.destroy();
    }
}

seed().catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
});
