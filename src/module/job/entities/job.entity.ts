import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('Job')
export class Job {
    @PrimaryGeneratedColumn()
    job_id: string;

    @Column()
    title: string;
}