import { Controller, Get, UseInterceptors, Param, SerializeOptions, ClassSerializerInterceptor, ParseIntPipe } from '@nestjs/common';
import { AttendeesService } from './attendee.service';

@Controller('events/:eventId/attendees')
@SerializeOptions({ strategy: 'excludeAll' })
export class EventAttendeesController {
    constructor(
        private readonly attendeesService: AttendeesService
    ) { }

    @Get()
    @UseInterceptors(ClassSerializerInterceptor)
    async findAll(@Param('eventId', ParseIntPipe) eventId: number) {
        return await this.attendeesService.findByEventId(eventId)
    }
}