import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { Report } from './entities/report.entity';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'better-sqlite3',
            database: 'report.db',
            entities: [Book, Report],
            synchronize: true,
        }),
    ],
})
export class DatabaseModule { }
