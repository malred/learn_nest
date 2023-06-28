import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './event.entity';
import { Attendee } from './attendee.entity';
import { EventsService } from './event.service';
import { AttendeesService } from './attendee.service';
import { EventAttendeesController } from './event-attendees.controller';
import { CurrentUserEventAttendanceController } from './current-user-event-attendance.controller';
import { EventsOrganizedByUserController } from './event-organized-by-user.controller';

@Module({
    imports: [
        // 操作数据库需要
        TypeOrmModule.forFeature([Event, Attendee])
    ],
    controllers: [
        EventsController,
        EventAttendeesController,
        CurrentUserEventAttendanceController,
        EventsOrganizedByUserController
    ],
    providers: [EventsService, AttendeesService]
})
export class EventsModule { }
