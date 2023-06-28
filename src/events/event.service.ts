// event.service.ts
import { Injectable } from "@nestjs/common";
import { Logger } from "@nestjs/common/services";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/auth/user.entity";
import { PaginateOptions, paginate } from "../pagination/paginator";
import { DeleteResult, Repository, SelectQueryBuilder } from "typeorm";
import { AttendeeAnswerEnum } from "./attendee.entity";
import { Event, PaginatedEvents } from "./event.entity";
import { CreateEventDto } from "./input/create-event.dto";
import { ListEvents, WhenEventFilter } from "./input/list.event";
import { UpdateEventDto } from "./input/update-event.dto";

@Injectable()
export class EventsService {
    private readonly logger = new Logger(EventsService.name)
    constructor(
        @InjectRepository(Event)
        private readonly eventsRepository: Repository<Event>,
    ) {

    }

    private getEventsBaseQuery(): SelectQueryBuilder<Event> {
        return this.eventsRepository
            .createQueryBuilder('e')
            // .select(['e.id', 'e.name'])
            .orderBy('e.id', 'ASC')
    }

    public getEventsWithAttendeeCountQuery(): SelectQueryBuilder<Event> {
        return this.getEventsBaseQuery() // 查询到所有events
            .loadRelationCountAndMap( // 给每个events的attendees注入值,值为关联的attendee的数量
                'e.attendeeCount', 'e.attendees'
            )
            .loadRelationCountAndMap(
                'e.attendeeAccepted',
                'e.attendees',
                'attendee',
                (qb) => qb.where(
                    'attendee.answer = :answer',
                    { answer: AttendeeAnswerEnum.Accepted }
                )
            )
            .loadRelationCountAndMap(
                'e.attendeeRejected', // mapToProperty映射到哪个值
                'e.attendees', // relationName关系名称
                'attendee', // aliasName数据库名
                (qb) => qb.where(
                    'attendee.answer = :answer',
                    { answer: AttendeeAnswerEnum.Rejected }
                )
            )
            .loadRelationCountAndMap(
                'e.attendeeMaybe',
                'e.attendees',
                'attendee',
                (qb) => qb.where(
                    'attendee.answer = :answer',
                    { answer: AttendeeAnswerEnum.Maybe }
                )
            )
    }

    private getEventsWithAttendeeCountFilteredQuery(
        filter?: ListEvents
    ): SelectQueryBuilder<Event> {
        let query = this.getEventsWithAttendeeCountQuery()

        if (!filter) {
            return query
        }

        if (filter.when) {
            if (filter.when == WhenEventFilter.Today) {
                query = query.andWhere(
                    `e.when >= CURDATE() AND e.when <= CURDATE() + INTERVAL 1 DAY`
                )
            }
            if (filter.when == WhenEventFilter.Tommorow) {
                query = query.andWhere(
                    `e.when >= CURDATE() + INTERVAL 1 DAY AND e.when <= CURDATE() + INTERVAL 2 DAY`
                )
            }
            if (filter.when == WhenEventFilter.ThisWeek) {
                query = query.andWhere('YEARWEEK(e.when, 1) = YEARWEEK(CURDATE(), 1)')
            }
            if (filter.when == WhenEventFilter.NextWeek) {
                query = query.andWhere('YEARWEEK(e.when, 1) = YEARWEEK(CURDATE(), 1) + 1')
            }
        }

        return query
    }

    public async getEventsWithAttendeeCountFilteredPaginated(
        filter: ListEvents,
        paginateOptions: PaginateOptions
    ): Promise<PaginatedEvents> {
        return await paginate(
            await this.getEventsWithAttendeeCountFilteredQuery(filter),
            paginateOptions
        )
    }

    public async getEventWithAttendeeCount(id: number): Promise<Event | undefined> {
        const query = this.getEventsWithAttendeeCountQuery()
            .andWhere('e.id = :id', { id }) // 根据id筛选结果
        this.logger.debug(await query.getSql())
        return await query.getOne()
    }

    public async findOne(id: number): Promise<Event | undefined> {
        return await this.eventsRepository.findOne({ where: { id } })
    }

    public async createEvent(input: CreateEventDto, user: User): Promise<Event> {
        return await this.eventsRepository.save(
            new Event({
                ...input,
                organizer: user,
                when: new Date(input.when)
            })
        )
    }

    public async updateEvent(event: Event, input: UpdateEventDto): Promise<Event> {
        return await this.eventsRepository.save(
            new Event({
                ...event, ...input,
                when: input.when ? new Date(input.when) : event.when
            })
        )
    }

    public async deleteEvent(id: number): Promise<DeleteResult> {
        return await this.eventsRepository
            .createQueryBuilder('e')
            .delete()
            .where('id = :id', { id })
            .execute()
    }

    public async getEventsOrganizedByUserIdPaginated(
        userId: number, paginateOptions: PaginateOptions
    ): Promise<PaginatedEvents> {
        return await paginate<Event>(
            this.getEventsOrganizedByUserIdQuery(userId),
            paginateOptions
        )
    }

    private getEventsOrganizedByUserIdQuery(
        userId: number
    ): SelectQueryBuilder<Event> {
        return this.getEventsBaseQuery()
            .where('e.organizerId = :userId', { userId })
    }

    public async getEventsAttendedByUserIdPaginated(
        userId: number, paginateOptions: PaginateOptions
    ): Promise<PaginatedEvents> {
        return await paginate<Event>(
            this.getEventsAttendedByUserIdQuery(userId),
            paginateOptions
        )
    }

    private getEventsAttendedByUserIdQuery(
        userId: number
    ): SelectQueryBuilder<Event> {
        return this.getEventsBaseQuery()
            .leftJoinAndSelect('e.attendees', 'a')
            .where('a.userId = :userId', { userId })
    }
}
