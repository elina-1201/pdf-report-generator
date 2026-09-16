import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('reports')
export class Report {
    @PrimaryColumn('uuid')
    id!: string;

    @Column({ type: 'text' })
    path!: string;

    @Column({ type: 'integer' })
    createdAt!: number;
}
