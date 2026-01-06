import Fastify, {type FastifyError} from 'fastify'
import helmet from '@fastify/helmet'
import cors from '@fastify/cors'
import rateLimit from '@fastify/rate-limit'
import swagger from '@fastify/swagger'
import {STATUS_CODES} from 'node:http'
import prismaPlugin from './plugins/prisma.js'
import {Type as T} from 'typebox'
import type {TypeBoxTypeProvider} from '@fastify/type-provider-typebox'
import {Health, ProblemDetails, User, ValidationProblem,} from './types.js'

// Этот модуль собирает все настройки Fastify: плагины инфраструктуры, обработчики ошибок и маршруты API.

/**
 * Создает и настраивает экземпляр Fastify, готовый к запуску.
 */
export async function buildApp() {
    const app = Fastify({
        logger: true, // Подключаем встроенный логгер Fastify.
        trustProxy: true, // Разрешаем доверять заголовкам X-Forwarded-* от прокси/ingress.
        /**
         * Схема валидации TypeBox -> Fastify генерирует массив ошибок.
         * Мы превращаем его в ValidationProblem, чтобы вернуть клиенту единый формат Problem Details.
         */
        schemaErrorFormatter(errors, dataVar) {
            const msg = errors.map((e) => e.message).filter(Boolean).join('; ') || 'Validation failed'
            return new ValidationProblem(msg, errors, dataVar)
        }
    }).withTypeProvider<TypeBoxTypeProvider>() // Позволяет Fastify понимать типы TypeBox при описании схем.

    // === Инфраструктурные плагины ===

    // Helmet добавляет безопасные HTTP-заголовки (Content-Security-Policy, X-DNS-Prefetch-Control и др.).
    await app.register(helmet)

    // CORS ограничивает кросс-доменные запросы. Здесь полностью запрещаем их (origin: false) по умолчанию.
    await app.register(cors, {
        origin: ["https://paperjett.github.io"],
        methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    });

    /**
     * Ограничитель количества запросов на IP.
     * Плагин автоматически вернет 429, а мы формируем Problem Details в errorResponseBuilder.
     */
    await app.register(rateLimit, {
        max: 100, // Максимум 100 запросов
        timeWindow: '1 minute', // За одну минуту
        enableDraftSpec: true, // Добавляет стандартные RateLimit-* заголовки в ответ
        addHeaders: {
            'x-ratelimit-limit': true,
            'x-ratelimit-remaining': true,
            'x-ratelimit-reset': true,
            'retry-after': true
        },
        errorResponseBuilder(request, ctx) {
            const seconds = Math.ceil(ctx.ttl / 1000)
            return {
                type: 'about:blank',
                title: 'Too Many Requests',
                status: 429,
                detail: `Rate limit exceeded. Retry in ${seconds} seconds.`,
                instance: request.url
            } satisfies ProblemDetails
        }
    })

    /**
     * Документация API в формате OpenAPI 3.0.
     */
    await app.register(swagger, {
        openapi: {
            openapi: '3.0.3',
            info: {
                title: 'Rooms API',
                version: '1.0.0',
                description: 'HTTP-API, совместим с RFC 9457.'
            },
            servers: [{ url: 'http://localhost:3000' }],
            tags: [
                { name: 'Users', description: 'Маршруты для управления пользователями' },
                { name: 'Rooms', description: 'Управление аудиториями' },
                { name: 'Bookings', description: 'Бронирование аудиторий' },
                { name: 'System', description: 'Служебные эндпоинты' }
            ]
        }
    })

    // Плагин с PrismaClient: открывает соединение с БД и добавляет app.prisma во все маршруты.
    await app.register(prismaPlugin)

    // === Глобальные обработчики ошибок ===

    /**
     * Единая точка обработки ошибок. Мы приводим их к Problem Details и отправляем клиенту JSON.
     * ValidationProblem превращается в 400, остальные ошибки хранят свой статус или получают 500.
     */
    app.setErrorHandler<FastifyError | ValidationProblem>((err, req, reply) => {
        const status = typeof err.statusCode === 'number' ? err.statusCode : 500
        const isValidation = err instanceof ValidationProblem

        const problem = {
            type: 'about:blank',
            title: STATUS_CODES[status] ?? 'Error',
            status,
            detail: err.message || 'Unexpected error',
            instance: req.url,
            ...(isValidation ? { errorsText: err.message } : {})
        }

        reply.code(status).type('application/problem+json').send(problem)
    })

    // Отдельный обработчик 404: отвечает в формате Problem Details.
    app.setNotFoundHandler((request, reply) => {
        reply.code(404).type('application/problem+json').send({
            type: 'about:blank',
            title: 'Not Found',
            status: 404,
            detail: `Route ${request.method} ${request.url} not found`,
            instance: request.url
        } satisfies ProblemDetails)
    })

    async function resolveRoomId(value: string): Promise<string> {
        const byId = await app.prisma.room.findUnique({
            where: { id: value },
            select: { id: true }
        })
        if (byId) return byId.id

        const byNumber = await app.prisma.room.findUnique({
            where: { number: value },
            select: { id: true }
        })
        if (byNumber) return byNumber.id

        const err = new Error(`Room not found: ${value}`)
        ;(err as unknown as FastifyError).statusCode = 400
        throw err
    }

    const BookingCreateBody = T.Object({
        title: T.String({ minLength: 1 }),
        eventType: T.String({ minLength: 1 }),

        startDate: T.String({ format: 'date-time' }),
        startTime: T.String({ format: 'date-time' }),
        endDate: T.Optional(T.String({ format: 'date-time' })),
        endTime: T.String({ format: 'date-time' }),

        organizerEmail: T.String({ format: 'email' }),
        organizerName: T.String({ minLength: 1 }),

        expectedParticipants: T.Integer({ minimum: 1 }),

        roomId: T.String({ minLength: 1 }),

        equipmentNeeded: T.Array(T.String())
    })

    const BookingUpdateBody = T.Partial(BookingCreateBody)

    function combineDateAndTime(date: Date, time: Date) {
        const d = new Date(date)
        d.setHours(
            time.getHours(),
            time.getMinutes(),
            time.getSeconds(),
            time.getMilliseconds()
        )
        return d
    }



    // === Маршруты API ===

    /**
     * GET /api/users — примеры чтения данных из базы через Prisma.
     */
    app.get(
        '/api/users',
        {
            schema: {
                operationId: 'listUsers',
                tags: ['Users'],
                summary: 'Возвращает список пользователей',
                description: 'Получаем id и email для каждого пользователя.',
                response: {
                    200: {
                        description: 'Список пользователей',
                        content: { 'application/json': { schema: T.Array(User) } }
                    },
                    429: {
                        description: 'Too Many Requests',
                        headers: {
                            'retry-after': {
                                schema: T.Integer({ minimum: 0, description: 'Через сколько секунд можно повторить запрос' })
                            }
                        },
                        content: { 'application/problem+json': { schema: ProblemDetails } }
                    },
                    500: {
                        description: 'Internal Server Error',
                        content: { 'application/problem+json': { schema: ProblemDetails } }
                    }
                }
            }
        },
        async (_req, _reply) => {
            // Prisma автоматически превращает результат в Promise; Fastify вернет массив как JSON.
            return app.prisma.user.findMany({ select: { id: true, email: true } })
        }
    )

    /**
     * GET /api/health — health-check для мониторинга.
     * Пытаемся сделать минимальный запрос в БД. Если БД недоступна, возвращаем 503.
     */
    app.get(
        '/api/health',
        {
            schema: {
                operationId: 'health',
                tags: ['System'],
                summary: 'Health/Readiness',
                description: 'Проверяет, что процесс жив и база данных отвечает.',
                response: {
                    200: {
                        description: 'Ready',
                        content: { 'application/json': { schema: Health } }
                    },
                    503: {
                        description: 'Temporarily unavailable',
                        content: { 'application/problem+json': { schema: ProblemDetails } }
                    },
                    429: {
                        description: 'Too Many Requests',
                        headers: {
                            'retry-after': { schema: T.Integer({ minimum: 0 }) }
                        },
                        content: { 'application/problem+json': { schema: ProblemDetails } }
                    },
                    500: {
                        description: 'Internal Server Error',
                        content: { 'application/problem+json': { schema: ProblemDetails } }
                    }
                }
            }
        },
        async (_req, reply) => {
            try {
                // Если SELECT 1 прошел — сервис готов.
                await app.prisma.$queryRaw`SELECT 1`
                return { ok: true } as Health
            } catch {
                // Возвращаем 503, чтобы условный балансировщик мог вывести инстанс из ротации.
                reply.code(503).type('application/problem+json').send({
                    type: 'https://example.com/problems/dependency-unavailable',
                    title: 'Service Unavailable',
                    status: 503,
                    detail: 'Database ping failed',
                    instance: '/api/health'
                } satisfies ProblemDetails)
            }
        }
    )

    // Служебный маршрут: возвращает OpenAPI-спецификацию.
    app.get(
        '/openapi.json',
        {
            schema: { hide: true, tags: ['Internal'] } // Скрыт из списка, но доступен для клиентов/тестов
        },
        async (_req, reply) => {
            reply.type('application/json').send(app.swagger())
        }
    )

    /**
     * GET /api/rooms — получение списка аудиторий из базы.
     */
    app.get(
        '/api/rooms',
        {
            schema: {
                operationId: 'listRooms',
                tags: ['Rooms'],
                summary: 'Возвращает список аудиторий',
                description: 'Получаем основные данные всех аудиторий.',
                response: {
                    200: {
                        description: 'Список аудиторий',
                        content: { 'application/json': {
                                schema: T.Array(T.Object({
                                    id: T.String(),
                                    number: T.String(),
                                    name: T.String(),
                                    capacity: T.Integer(),
                                    status: T.String(),
                                    equipment: T.Array(T.String()),
                                    createdAt: T.String({ format: 'date-time' }),
                                    updatedAt: T.String({ format: 'date-time' })
                                }))
                            } }
                    },
                    429: {
                        description: 'Too Many Requests',
                        headers: {
                            'retry-after': {
                                schema: T.Integer({ minimum: 0, description: 'Через сколько секунд можно повторить запрос' })
                            }
                        },
                        content: { 'application/problem+json': { schema: ProblemDetails } }
                    },
                    500: {
                        description: 'Internal Server Error',
                        content: { 'application/problem+json': { schema: ProblemDetails } }
                    }
                }
            }
        },
        async (_req, _reply) => {
            const rooms = await app.prisma.room.findMany({
                select: {
                    id: true,
                    number: true,
                    name: true,
                    capacity: true,
                    status: true,
                    equipment: true,
                    createdAt: true,
                    updatedAt: true
                },
                orderBy: { number: 'asc' }
            })

            return rooms.map(room => ({
                id: room.id,
                number: room.number,
                name: room.name,
                capacity: room.capacity,
                status: room.status.toString(),
                equipment: room.equipment,
                createdAt: room.createdAt.toISOString(),
                updatedAt: room.updatedAt.toISOString()
            }))
        }
    )

    /**
     * GET /api/bookings — получение списка бронирований из базы.
     */
    app.get(
        '/api/bookings',
        {
            schema: {
                operationId: 'listBookings',
                tags: ['Bookings'],
                summary: 'Возвращает список бронирований',
                description: 'Получаем основные данные всех бронирований.',
                response: {
                    200: {
                        description: 'Список бронирований',
                        content: { 'application/json': {
                                schema: T.Array(T.Object({
                                    id: T.String(),
                                    title: T.String(),
                                    startDate: T.String({ format: 'date-time' }),
                                    startTime: T.String({ format: 'date-time' }),
                                    endTime: T.String({ format: 'date-time' }),
                                    status: T.String(),
                                    organizerName: T.String(),
                                    organizerEmail: T.String({ format: 'email' }),
                                    roomId: T.String(),
                                    expectedParticipants: T.Integer(),
                                    room: T.Optional(
                                        T.Object({
                                            number: T.String(),
                                        })
                                    ),
                                }))
                            } }
                    },
                    429: {
                        description: 'Too Many Requests',
                        headers: {
                            'retry-after': {
                                schema: T.Integer({ minimum: 0, description: 'Через сколько секунд можно повторить запрос' })
                            }
                        },
                        content: { 'application/problem+json': { schema: ProblemDetails } }
                    },
                    500: {
                        description: 'Internal Server Error',
                        content: { 'application/problem+json': { schema: ProblemDetails } }
                    }
                }
            }
        },
        async (_req, _reply) => {
            const bookings = await app.prisma.booking.findMany({
                select: {
                    id: true,
                    title: true,
                    startDate: true,
                    startTime: true,
                    endTime: true,
                    status: true,
                    organizerName: true,
                    organizerEmail: true,
                    roomId: true,
                    expectedParticipants: true,
                    room: { select: { number: true } },
                },
                orderBy: { startDate: 'desc' }
            })

            return bookings.map(booking => ({
                ...booking,
                startDate: booking.startDate.toISOString(),
                startTime: booking.startTime.toISOString(),
                endTime: booking.endTime.toISOString(),
                ...(booking.room ? { room: { number: booking.room.number } } : {}),
                status: booking.status.toString() // на всякий случай
            }))
        }
    )

    app.get(
        '/api/bookings/:id',
        {
            schema: {
                operationId: 'getBookingById',
                tags: ['Bookings'],
                summary: 'Возвращает бронирование по id',
                description: 'Получаем основные данные одного бронирования.',
                params: T.Object({
                    id: T.String({ description: 'ID бронирования' })
                }),
                response: {
                    200: {
                        description: 'Бронирование',
                        content: {
                            'application/json': {
                                schema: T.Object({
                                    id: T.String(),
                                    title: T.String(),
                                    eventType: T.String(),
                                    startDate: T.String({ format: 'date-time' }),
                                    startTime: T.String({ format: 'date-time' }),
                                    endTime: T.String({ format: 'date-time' }),
                                    status: T.String(),
                                    organizerName: T.String(),
                                    organizerEmail: T.String({ format: 'email' }),
                                    roomId: T.String(),
                                    expectedParticipants: T.Integer(),
                                    room: T.Optional(
                                        T.Object({
                                            number: T.String(),
                                        })
                                    ),
                                })
                            }
                        }
                    },
                    404: {
                        description: 'Not Found',
                        content: { 'application/problem+json': { schema: ProblemDetails } }
                    },
                    429: {
                        description: 'Too Many Requests',
                        headers: {
                            'retry-after': {
                                schema: T.Integer({ minimum: 0 })
                            }
                        },
                        content: { 'application/problem+json': { schema: ProblemDetails } }
                    },
                    500: {
                        description: 'Internal Server Error',
                        content: { 'application/problem+json': { schema: ProblemDetails } }
                    }
                }
            }
        },
        async (req, reply) => {
            const { id } = req.params as { id: string }

            const booking = await app.prisma.booking.findUnique({
                where: { id },
                select: {
                    id: true,
                    title: true,
                    eventType: true,
                    startDate: true,
                    startTime: true,
                    endTime: true,
                    status: true,
                    organizerName: true,
                    organizerEmail: true,
                    roomId: true,
                    expectedParticipants: true
                }
            })

            if (!booking) {
                reply.code(404).type('application/problem+json').send({
                    type: 'about:blank',
                    title: 'Not Found',
                    status: 404,
                    detail: 'Booking not found',
                    instance: req.url
                } satisfies ProblemDetails)
                return
            }

            return {
                ...booking,
                startDate: booking.startDate.toISOString(),
                startTime: booking.startTime.toISOString(),
                endTime: booking.endTime.toISOString(),
                status: booking.status.toString()
            }
        }
    )

    app.post('/api/dev/seed-rooms', { schema: { hide: true } }, async () => {
        const count = await app.prisma.room.count();
        if (count > 0) return { ok: true, created: 0 };

        const rooms = [
            { number: '101', name: 'Аудитория 101', capacity: 30, equipment: ['projector'], status: 'AVAILABLE' as const },
            { number: '102', name: 'Аудитория 102', capacity: 25, equipment: ['pc'], status: 'AVAILABLE' as const },
            { number: '103', name: 'Аудитория 103', capacity: 40, equipment: [], status: 'AVAILABLE' as const },
            { number: '201', name: 'Аудитория 201', capacity: 50, equipment: ['projector','mic'], status: 'AVAILABLE' as const },
        ];

        await app.prisma.room.createMany({ data: rooms });
        return { ok: true, created: rooms.length };
    });

    app.post(
        '/api/bookings',
        {
            schema: {
                operationId: 'createBooking',
                tags: ['Bookings'],
                summary: 'Создаёт бронирование',
                body: BookingCreateBody,
                response: {
                    201: {
                        description: 'Создано',
                        content: { 'application/json': { schema: T.Object({ id: T.String() }) } }
                    },
                    400: {
                        description: 'Bad Request',
                        content: { 'application/problem+json': { schema: ProblemDetails } }
                    },
                    429: {
                        description: 'Too Many Requests',
                        headers: {
                            'retry-after': { schema: T.Integer({ minimum: 0 }) }
                        },
                        content: { 'application/problem+json': { schema: ProblemDetails } }
                    },
                    500: {
                        description: 'Internal Server Error',
                        content: { 'application/problem+json': { schema: ProblemDetails } }
                    }
                }
            }
        },
        async (req, reply) => {
            const body = req.body as {
                title: string
                eventType: string
                startDate: string
                startTime: string
                endDate?: string
                endTime: string
                organizerEmail: string
                organizerName: string
                expectedParticipants: number
                roomId: string
                equipmentNeeded: string[]
            }

            const startDate = new Date(body.startDate)
            const endDate = body.endDate ? new Date(body.endDate) : startDate

            const rawStartTime = new Date(body.startTime)
            const rawEndTime   = new Date(body.endTime)

            const startTime = combineDateAndTime(startDate, rawStartTime)
            const endTime   = combineDateAndTime(endDate, rawEndTime)

            if (!(startTime < endTime)) {
                reply.code(400).type('application/problem+json').send({
                    type: 'about:blank',
                    title: 'Bad Request',
                    status: 400,
                    detail: 'startTime must be earlier than endTime',
                    instance: req.url
                } satisfies ProblemDetails)
                return
            }

            const roomId = await resolveRoomId(body.roomId)

            const created = await app.prisma.booking.create({
                data: {
                    title: body.title,
                    eventType: body.eventType,
                    startDate,
                    endDate,
                    startTime,
                    endTime,
                    organizerEmail: body.organizerEmail,
                    organizerName: body.organizerName,
                    expectedParticipants: body.expectedParticipants,
                    equipmentNeeded: body.equipmentNeeded,
                    roomId
                },
                select: { id: true }
            })

            reply.code(201)
            return created
        }
    )

    app.patch(
        '/api/bookings/:id',
        {
            schema: {
                operationId: 'updateBooking',
                tags: ['Bookings'],
                summary: 'Обновляет бронирование',
                params: T.Object({ id: T.String() }),
                body: BookingUpdateBody,
                response: {
                    200: {
                        description: 'Обновлено',
                        content: { 'application/json': { schema: T.Object({ id: T.String() }) } }
                    },
                    404: {
                        description: 'Not Found',
                        content: { 'application/problem+json': { schema: ProblemDetails } }
                    },
                    400: {
                        description: 'Bad Request',
                        content: { 'application/problem+json': { schema: ProblemDetails } }
                    },
                    429: {
                        description: 'Too Many Requests',
                        headers: {
                            'retry-after': { schema: T.Integer({ minimum: 0 }) }
                        },
                        content: { 'application/problem+json': { schema: ProblemDetails } }
                    },
                    500: {
                        description: 'Internal Server Error',
                        content: { 'application/problem+json': { schema: ProblemDetails } }
                    }
                }
            }
        },
        async (req, reply) => {
            const { id } = req.params as { id: string }
            const body = req.body as Partial<{
                title: string
                eventType: string
                startDate: string
                endDate: string
                startTime: string
                endTime: string
                organizerEmail: string
                organizerName: string
                expectedParticipants: number
                roomId: string
                equipmentNeeded: string[]
            }>

            const existing = await app.prisma.booking.findUnique({
                where: { id },
                select: { id: true, startDate: true, endDate: true, startTime: true, endTime: true }
            })

            if (!existing) {
                reply.code(404).type('application/problem+json').send({
                    type: 'about:blank',
                    title: 'Not Found',
                    status: 404,
                    detail: 'Booking not found',
                    instance: req.url
                } satisfies ProblemDetails)
                return
            }

            const data: Record<string, unknown> = {}

            if (body.title !== undefined) data.title = body.title
            if (body.eventType !== undefined) data.eventType = body.eventType
            if (body.organizerEmail !== undefined) data.organizerEmail = body.organizerEmail
            if (body.organizerName !== undefined) data.organizerName = body.organizerName
            if (body.expectedParticipants !== undefined) data.expectedParticipants = body.expectedParticipants
            if (body.equipmentNeeded !== undefined) data.equipmentNeeded = body.equipmentNeeded ?? []

            if (body.roomId !== undefined) {
                data.roomId = await resolveRoomId(body.roomId)
            }

            const startDate = body.startDate ? new Date(body.startDate) : existing.startDate

            let endDate: Date
            if (body.endDate) {
                endDate = new Date(body.endDate)
            } else if (body.startDate && existing.endDate === null) {
                endDate = startDate
            } else {
                endDate = existing.endDate ?? existing.startDate
            }

            if (body.startDate !== undefined) data.startDate = startDate
            if (body.endDate !== undefined) data.endDate = endDate

            const rawStartTime = body.startTime ? new Date(body.startTime) : existing.startTime
            const rawEndTime   = body.endTime ? new Date(body.endTime) : existing.endTime

            const startTime = combineDateAndTime(startDate, rawStartTime)
            const endTime   = combineDateAndTime(endDate, rawEndTime)

            const touchesTime =
                body.startDate !== undefined ||
                body.endDate !== undefined ||
                body.startTime !== undefined ||
                body.endTime !== undefined

            if (touchesTime) {
                if (!(startTime < endTime)) {
                    reply.code(400).type('application/problem+json').send({
                        type: 'about:blank',
                        title: 'Bad Request',
                        status: 400,
                        detail: 'startTime must be earlier than endTime',
                        instance: req.url
                    } satisfies ProblemDetails)
                    return
                }

                data.startTime = startTime
                data.endTime = endTime
            }

            return await app.prisma.booking.update({
                where: { id },
                data,
                select: { id: true }
            })
        }
    )

    app.delete(
        '/api/bookings/:id',
        {
            schema: {
                operationId: 'deleteBooking',
                tags: ['Bookings'],
                summary: 'Удаляет бронирование',
                params: T.Object({ id: T.String() }),
                response: {
                    204: { description: 'Deleted' },
                    404: {
                        description: 'Not Found',
                        content: { 'application/problem+json': { schema: ProblemDetails } }
                    }
                }
            }
        },
        async (req, reply) => {
            const { id } = req.params as { id: string }

            const exists = await app.prisma.booking.findUnique({ where: { id }, select: { id: true } })
            if (!exists) {
                reply.code(404).type('application/problem+json').send({
                    type: 'about:blank',
                    title: 'Not Found',
                    status: 404,
                    detail: 'Booking not found',
                    instance: req.url
                } satisfies ProblemDetails)
                return
            }

            await app.prisma.booking.delete({ where: { id } })
            reply.code(204).send()
        }
    )


    return app
}