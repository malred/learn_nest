import { Repository } from "typeorm"
import { EventsService } from "./event.service"
import { EventsController } from "./events.controller"
import { Event } from "./event.entity"
import { ListEvents } from "./input/list.event"
import { User } from "../auth/user.entity"
import { NotFoundException } from '@nestjs/common';

describe('EventsController', () => {
    let eventsService: EventsService
    let eventsController: EventsController
    let eventsRepository: Repository<Event>

    // beforeAll(() => console.log('this logged once'))
    beforeEach(() => {
        eventsService = new EventsService(eventsRepository)
        eventsController = new EventsController(eventsService)
    })
    // it === test
    it('should return a list of events', async () => {
        const result = {
            first: 1,
            last: 1,
            limit: 10,
            data: []
        }

        // 模拟方法,并提供方法实现(不依赖/使用外部方法,只提供模拟调用的结果,查看功能是否可用)
        // eventsService.getEventsWithAttendeeCountFilteredPaginated
        //     = jest.fn().mockImplementation((): any => result)

        // 监视并模拟方法
        const spy = jest
            .spyOn(eventsService, 'getEventsWithAttendeeCountFilteredPaginated')
            .mockImplementation((): any => result)

        expect(await eventsController.findAll(new ListEvents))
            .toEqual(result)
        // 只想调用一次 
        expect(spy).toBeCalledTimes(1)
    })

    it('should not delete an event, when it\'s not found', async () => {
        const deleteSpy = jest.spyOn(eventsService, 'deleteEvent')

        const findSpy = jest.spyOn(eventsService, 'findOne')
            .mockImplementation((): any => undefined)

        try {
            await eventsController.remove(1, new User())
        } catch (error) {
            expect(error).toBeInstanceOf(NotFoundException)
        }

        // 找不到就不能删除
        expect(deleteSpy).toBeCalledTimes(0)
        expect(findSpy).toBeCalledTimes(1)
    })
})