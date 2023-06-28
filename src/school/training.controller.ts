import { Controller, Post } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subject } from './subject.entity';
import { Teacher } from './teacher.entity';
import { Profile } from "src/auth/profile.entity";
import { User } from "src/auth/user.entity";

@Controller('school')
export class TrainingController {
    constructor(
        @InjectRepository(Subject)
        private readonly subjectRepository: Repository<Subject>,
        @InjectRepository(Teacher)
        private readonly teacherRepository: Repository<Teacher>
    ) { }

    @Post('/create')
    public async savingRelation() {
        // const subject = new Subject();
        // subject.name = 'Math';

        const subject = await this.subjectRepository.findOne({ where: { id: 3 } })

        // const teacher1 = new Teacher();
        // teacher1.name = 'John Doe';

        // const teacher2 = new Teacher();
        // teacher2.name = 'Harry Doe';

        // subject.teachers = [teacher1, teacher2];

        // await this.teacherRepository.save([teacher1, teacher2]);
        // const user = new User();
        // const profile = new Profile();

        // user.profile = profile
        // 不可以为空
        // user.profile = null

        const t1 = await this.teacherRepository.findOne({ where: { id: 3 } })
        const t2 = await this.teacherRepository.findOne({ where: { id: 4 } })
        return await this.subjectRepository
            .createQueryBuilder()
            .relation(Subject, 'teachers')
            .of(subject)
            .add([t1, t2])
    }

    @Post('/remove')
    public async removingRelation() {
        // const subject = await this.subjectRepository.findOne(
        //     {
        //         where: { id: 1 },
        //         relations: ['teachers']
        //     }
        // );

        // subject.teachers = subject.teachers.filter(
        //     teacher => teacher.id !== 2
        // );
        // 把name属性改成Confidential
        await this.subjectRepository.createQueryBuilder('e')
            .update()
            .set({ name: 'Confidential' })
            .execute()
    }
}