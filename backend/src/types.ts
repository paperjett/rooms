import type { FastifyError, FastifySchemaValidationError } from 'fastify'
import type { SchemaErrorDataVar } from 'fastify/types/schema.js'
import { Type as T, type Static } from 'typebox'

// Этот модуль собирает переиспользуемые типы и схемы, которые нужны маршрутам Fastify и плагинам.
// Комментарии поясняют не только назначение сущностей, но и связи между Fastify, TypeBox и Prisma.

/**
 * Обёртка над стандартной ошибкой Fastify для случаев, когда схема запроса не проходит валидацию.
 * Мы расширяем Error, чтобы получить сообщение и stack trace, и одновременно реализуем FastifyError,
 * чтобы Fastify понимал код ошибки и корректно возвращал ответ клиенту.
 */
export class ValidationProblem extends Error implements FastifyError {
    public readonly name = 'ValidationError'
    public readonly code = 'FST_ERR_VALIDATION'
    public readonly statusCode = 400
    public readonly validation: FastifySchemaValidationError[]
    public readonly validationContext: SchemaErrorDataVar

    /**
     * @param message Сообщение об ошибке, которое увидит клиент.
     * @param errs Подробные сведения о том, какие поля не прошли проверку схемы.
     * @param ctx Контекст (какая часть запроса проверялась: body, params и т.д.), полезно для логирования.
     * @param options Стандартные опции конструктора Error (причина ошибки, управление stack trace и т.д.).
     */
    constructor(
        message: string,
        errs: FastifySchemaValidationError[],
        ctx: SchemaErrorDataVar,
        options?: ErrorOptions
    ) {
        super(message, options)
        this.validation = errs
        this.validationContext = ctx
    }
}

// Схема ответа в формате RFC 7807 (Problem Details) — единый JSON-формат для сообщений об ошибках.
export const ProblemDetails = T.Object(
    {
        type: T.String({
            description: 'URI с подробным описанием ошибки (по умолчанию about:blank)'
        }),
        title: T.String({
            description: 'Короткое человекочитаемое резюме проблемы'
        }),
        status: T.Integer({
            minimum: 100,
            maximum: 599,
            description: 'HTTP-статус, с которым был отправлен ответ'
        }),
        detail: T.Optional(
            T.String({
                description: 'Дополнительные сведения о том, что пошло не так'
            })
        ),
        instance: T.Optional(
            T.String({
                description: 'URI запроса, в котором возникла проблема (если полезно для клиента)'
            })
        ),
        // Поле errorsText даёт краткое текстовое представление всех ошибок валидации, если они есть.
        errorsText: T.Optional(
            T.String({
                description: 'Сводное описание всех ошибок, собранных валидацией Fastify'
            })
        )
    },
    { additionalProperties: true }
)

export type ProblemDetails = Static<typeof ProblemDetails>

// Схема и тип пользователя, которые используются и в валидаторах, и в ответах API.
export const User = T.Object({
    id: T.String({ description: 'Уникальный идентификатор пользователя (UUID или аналогичный формат)' }),
    email: T.String({
        format: 'email',
        description: 'Адрес электронной почты, используется как логин и для отправки уведомлений'
    })
})
export type User = Static<typeof User>

// Минимальная схема для health-check запроса: позволяет внешним сервисам понять, что backend жив.
export const Health = T.Object({
    ok: T.Boolean({
        description: 'Флаг готовности сервиса: true означает, что Fastify и его зависимости работают'
    })
})
export type Health = Static<typeof Health>

// Список оборудования

export const EquipmentEnum = T.Union([
    T.Literal('PROJECTOR', { description: 'Проектор для презентаций' }),
    T.Literal('MICROPHONE', { description: 'Микрофон для выступлений' }),
    T.Literal('COMPUTER', { description: 'Компьютер с необходимым ПО' }),
    T.Literal('INTERACTIVE_BOARD', { description: 'Интерактивная доска' }),
    T.Literal('VIDEO_CONFERENCE', { description: 'Оборудование для видеоконференций' }),
    T.Literal('WIFI', { description: 'Беспроводной интернет' }),
    T.Literal('AIR_CONDITIONING', { description: 'Система кондиционирования' }),
    T.Literal('SOUND_SYSTEM', { description: 'Звуковая система' }),
    T.Literal('LAB_EQUIPMENT', { description: 'Лабораторное оборудование' })
], {
    description: 'Доступные типы оборудования в аудиториях'
})

export type EquipmentEnum = Static<typeof EquipmentEnum>

export const Equipment = T.Array(EquipmentEnum, {
    description: 'Список оборудования'
})

export type Equipment = Static<typeof Equipment>

// Типы статусов

export const RoomStatusEnum = T.Union([
    T.Literal('AVAILABLE', { description: 'Доступна для бронирования' }),
    T.Literal('BOOKED', { description: 'Забронирована на конкретное время' }),
    T.Literal('MAINTENANCE', { description: 'На техническом обслуживании' }),
    T.Literal('UNAVAILABLE', { description: 'Временно недоступна по другим причинам' })
], {
    description: 'Статусы доступности аудитории'
})

export type RoomStatusEnum = Static<typeof RoomStatusEnum>

export const BookingStatusEnum = T.Union([
    T.Literal('PENDING', { description: 'Ожидает подтверждения администратором' }),
    T.Literal('CONFIRMED', { description: 'Подтверждена, аудитория зарезервирована' }),
    T.Literal('CANCELLED', { description: 'Отменена организатором или администратором' }),
    T.Literal('COMPLETED', { description: 'Мероприятие успешно завершено' }),
    T.Literal('REJECTED', { description: 'Отклонена администратором' })
], {
    description: 'Статусы жизненного цикла бронирования'
})

export type BookingStatusEnum = Static<typeof BookingStatusEnum>

// Типы аудиторий (Rooms)

export const Room = T.Object({
    id: T.String({
        description: 'Уникальный идентификатор аудитории'
    }),
    number: T.String({
        description: 'Номер аудитории, используется как уникальный человекочитаемый идентификатор'
    }),
    name: T.Optional(T.String({
        description: 'Название аудитории (например, "Конференц-зал им. Петрова")'
    })),
    capacity: T.Integer({
        minimum: 1,
        description: 'Вместимость аудитории в количестве человек'
    }),
    equipment: Equipment,
    status: RoomStatusEnum,
    createdAt: T.String({
        format: 'date-time',
        description: 'Дата и время создания записи об аудитории'
    }),
    updatedAt: T.String({
        format: 'date-time',
        description: 'Дата и время последнего обновления информации об аудитории'
    })
}, {
    description: 'Аудитория (кабинет) — помещение, которое можно забронировать для мероприятия'
})

export type Room = Static<typeof Room>

// Типы бронирований (Bookings)

export const Booking = T.Object({
    id: T.String({
        description: 'Уникальный идентификатор бронирования'
    }),

    // Основная информация
    title: T.String({
        minLength: 1,
        description: 'Название мероприятия'
    }),
    eventType: T.String({
        minLength: 1,
        description: 'Тип мероприятия (лекция, семинар, конференция и т.д.)'
    }),
    subject: T.Optional(T.String({
        description: 'Предмет или дисциплина (для учебных мероприятий)'
    })),
    format: T.Optional(T.String({
        description: 'Формат проведения (очно, онлайн, гибридный)'
    })),
    description: T.Optional(T.String({
        description: 'Подробное описание мероприятия'
    })),

    // Дата и время
    startDate: T.String({
        format: 'date-time',
        description: 'Дата начала мероприятия'
    }),
    endDate: T.Optional(T.String({
        format: 'date-time',
        description: 'Дата окончания мероприятия (для многодневных событий)'
    })),
    startTime: T.String({
        format: 'date-time',
        description: 'Время начала мероприятия в выбранный день'
    }),
    endTime: T.String({
        format: 'date-time',
        description: 'Время окончания мероприятия'
    }),
    cleanupTime: T.Optional(T.Integer({
        minimum: 0,
        description: 'Время на уборку после мероприятия (в минутах)'
    })),
    setupTime: T.Optional(T.Integer({
        minimum: 0,
        description: 'Время на подготовку перед мероприятием (в минутах)'
    })),

    // Связи с аудиториями
    roomId: T.String({
        description: 'ID основной аудитории'
    }),
    backupRoomId: T.Optional(T.String({
        description: 'ID запасной аудитории на случай недоступности основной'
    })),

    // Организатор
    organizerEmail: T.String({
        format: 'email',
        description: 'Email организатора мероприятия'
    }),
    organizerPhone: T.Optional(T.String({
        description: 'Телефон организатора для экстренной связи'
    })),
    organizerPosition: T.Optional(T.String({
        description: 'Должность организатора'
    })),
    organizerName: T.String({
        minLength: 1,
        description: 'ФИО организатора'
    }),
    organizerDepartment: T.Optional(T.String({
        description: 'Кафедра или отдел организатора'
    })),
    organizerFaculty: T.Optional(T.String({
        description: 'Факультет организатора'
    })),

    // Участники
    expectedParticipants: T.Integer({
        minimum: 1,
        description: 'Ожидаемое количество участников'
    }),
    participantType: T.Optional(T.String({
        description: 'Тип участников (студенты, преподаватели, гости и т.д.)'
    })),
    specialRequirements: T.Optional(T.String({
        description: 'Особые требования к участникам или особые условия мероприятия'
    })),

    // Оборудование и требования
    equipmentNeeded: Equipment,
    additionalComments: T.Optional(T.String({
        description: 'Дополнительные требования и комментарии'
    })),

    // Системные поля
    status: BookingStatusEnum,
    createdAt: T.String({
        format: 'date-time',
        description: 'Дата и время создания бронирования'
    }),
    updatedAt: T.String({
        format: 'date-time',
        description: 'Дата и время последнего обновления бронирования'
    }),
    userId: T.Optional(T.String({
        description: 'ID пользователя, создавшего бронирование (если авторизован)'
    }))
}, {
    description: 'Бронирование аудитории для проведения мероприятия'
})

export type Booking = Static<typeof Booking>