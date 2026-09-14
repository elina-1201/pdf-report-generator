import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from '../reports/book.entity';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'better-sqlite3',
            database: 'report.db',
            entities: [Book],
            synchronize: true,
        }),
        TypeOrmModule.forFeature([Book]),
    ],
    exports: [TypeOrmModule],
})
export class DatabaseModule { }
