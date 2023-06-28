import { Module } from '@nestjs/common';
import { TrainingController } from './training.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Teacher } from './teacher.entity';
import { Subject } from './subject.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Subject, Teacher])],
  controllers: [TrainingController]
})
export class SchoolModule { }
