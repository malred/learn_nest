import { Body, ClassSerializerInterceptor, Controller, Delete, ForbiddenException, Get, HttpCode, Logger, NotFoundException, Param, ParseIntPipe, Patch, Post, Query, SerializeOptions, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuardJwt } from '../auth/auth-guard.jwt';
import { CurrentUser } from '../auth/current-user.decorate';
import { User } from '../auth/user.entity';
import { EventsService } from './event.service';
import { CreateEventDto } from './input/create-event.dto';
import { ListEvents } from './input/list.event';
import { UpdateEventDto } from './input/update-event.dto';
@Controller('events')
@SerializeOptions({
    strategy: 'excludeAll' // 序列化时排除所有,res为空
})
export class EventsController {
    // 日志
    private readonly logger = new Logger(EventsController.name);

    // 依赖注入
    constructor(
        private readonly eventsService: EventsService
    ) { }

    @Get() // Query: ?xxx=xxx
    @UsePipes(new ValidationPipe({ transform: true })) // 没有提供值时,会填充默认值
    @UseInterceptors(ClassSerializerInterceptor)
    async findAll(@Query() filter: ListEvents) {
        const events = await this.eventsService
            .getEventsWithAttendeeCountFilteredPaginated(
                filter,
                {
                    total: true,
                    currentPage: filter.page,
                    limit: 2,
                    // ...filter
                }
            )
        return events
    }

    @Get(':id')
    @UseInterceptors(ClassSerializerInterceptor)
    async findOne(@Param('id', ParseIntPipe) id: number) {
        const event = await this.eventsService.getEventWithAttendeeCount(id)

        if (!event) {
            throw new NotFoundException()
        }
        return event
    }

    @Post()
    @UseGuards(AuthGuardJwt)
    @UseInterceptors(ClassSerializerInterceptor)
    async create(
        @Body() input: CreateEventDto,
        @CurrentUser() user: User
    ) {
        return await this.eventsService.createEvent(input, user)
    }

    @Patch(':id')
    @UseGuards(AuthGuardJwt)
    @UseInterceptors(ClassSerializerInterceptor)
    async update(
        @Param('id', ParseIntPipe) id,
        @Body() input: UpdateEventDto,
        @CurrentUser() user: User,
    ) {
        const event = await this.eventsService.findOne(id)

        if (!event) {
            throw new NotFoundException()
        }

        if (event.organizerId !== user.id) {
            throw new ForbiddenException(
                null, `You are not allowed to change this event`
            )
        }

        return await this.eventsService.updateEvent(event, input)
    }
    @Delete(':id')
    @UseGuards(AuthGuardJwt)
    @HttpCode(204)
    async remove(
        @Param('id', ParseIntPipe) id,
        @CurrentUser() user: User,
    ) {
        const event = await this.eventsService.findOne(id)

        if (!event) {
            throw new NotFoundException()
        }

        if (event.organizerId !== user.id) {
            throw new ForbiddenException(
                null, `You are not allowed to remove this event`
            )
        }

        await this.eventsService.deleteEvent(id)
    }
}
