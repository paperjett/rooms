import { http } from "@/api/http";

export type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED" | "REJECTED";

export type BookingDto = {
    id: string;
    title: string;
    eventType: string;
    subject?: string | null;
    format?: string | null;
    description?: string | null;

    startDate: string;
    endDate?: string | null;
    startTime: string;
    endTime: string;

    cleanupTime?: number | null;
    setupTime?: number | null;

    roomId: string;
    backupRoomId?: string | null;

    organizerEmail: string;
    organizerName: string;
    organizerPhone?: string | null;
    organizerPosition?: string | null;
    organizerDepartment?: string | null;
    organizerFaculty?: string | null;

    expectedParticipants: number;
    participantType?: string | null;
    specialRequirements?: string | null;

    equipmentNeeded: string[];
    additionalComments?: string | null;

    status: BookingStatus;

    room?: { number: string } | null
};

export type BookingCreateDto = Omit<BookingDto, "id" | "room">;

export async function fetchActiveBookings() {
    const { data } = await http.get<BookingDto[]>("/bookings", { params: { active: "true" } });
    return data;
}

export async function fetchBookingById(id: string) {
    const { data } = await http.get<BookingDto>(`/bookings/${id}`);
    return data;
}

export async function createBooking(payload: BookingCreateDto) {
    const { data } = await http.post<{ id: string }>("/bookings", payload);
    return data;
}

export async function updateBooking(id: string, payload: Partial<BookingCreateDto>) {
    const { data } = await http.patch<{ id: string }>(`/bookings/${id}`, payload);
    return data;
}

export async function deleteBooking(id: string) {
    await http.delete(`/bookings/${id}`);
}
