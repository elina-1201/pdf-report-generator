import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('books')
export class Book {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'text' })
    title!: string;

    @Column({ type: 'real' })
    price!: number;

    @Column({ type: 'integer' })
    rating!: number;

    @Column({ type: 'text' })
    url!: string;
}
