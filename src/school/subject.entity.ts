import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Teacher } from './teacher.entity';

@Entity()
export class Subject {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToMany(
        () => Teacher, (teacher) => teacher.subjects, { cascade: true }
    )
    @JoinTable() // 会创建一个关系表(subject_teachers_teacher)
    teachers: Teacher[];
}