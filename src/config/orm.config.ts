import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { Event } from "src/events/event.entity";
import { registerAs } from '@nestjs/config'
import { Attendee } from "src/events/attendee.entity";
import { Subject } from "src/school/subject.entity";
import { Teacher } from "src/school/teacher.entity";
import { User } from "src/auth/user.entity";
import { Profile } from "src/auth/profile.entity";

export default registerAs('org.config', (): TypeOrmModuleOptions => ({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    // 使用实体需要在这里引入
    entities: [Event, Attendee, Subject, Teacher, User, Profile],
    // 自动建表，你修改 Entity 里面字段，
    // 或者 *.entity{.ts,.js } 的名字，都会自动帮你修改。
    synchronize: true
}))