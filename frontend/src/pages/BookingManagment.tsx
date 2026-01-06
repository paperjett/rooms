import React, {useState, useEffect, useCallback} from "react";
import { Title } from "@/components/Title";
import { Button } from "@/components/Button";
import SaveIcon from "@mui/icons-material/Save";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import {
    DateTimeSection,
    MainInfoSection,
    AuditoriumSection,
    ParticipantsSection,
    EquipmentSection,
    NotificationSection,
} from "@/components/BookingSections";
import { BookingStatus } from "@/components/BookingStatus";
import { Box, Stack } from "@mui/material";
import {Tips} from "@/components/Tips";
import {BookingActions} from "@/components/BookingActions";
import { fetchBookingById, createBooking, updateBooking, type BookingCreateDto } from "@/api/bookingsApi";

export const BookingManagment: React.FC<{
    mode: "create" | "edit";
    bookingId?: string;
    onBack: () => void;
}> = ({ mode, bookingId, onBack }) => {
    const [sectionStatus, setSectionStatus] = useState({
        main: false,
        datetime: false,
        auditorium: true,
        participants: {
            organizer: false,
            participants: false,
        },
        equipment: true,
    });

    const emptyForm: BookingCreateDto = {
        title: "",
        eventType: "lecture",
        startDate: new Date().toISOString(),
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        organizerEmail: "",
        organizerName: "",
        expectedParticipants: 1,
        roomId: "",
        equipmentNeeded: [],
        status: "PENDING",
    };

    const canSave =
        sectionStatus.main &&
        sectionStatus.datetime &&
        sectionStatus.auditorium &&
        sectionStatus.participants &&
        sectionStatus.equipment;

    const [form, setForm] = useState<BookingCreateDto>(emptyForm);
    const [loading, setLoading] = useState(mode === "edit");
    const [error, setError] = useState<string | null>(null);

    const patchForm = (patch: Partial<BookingCreateDto>) =>
        setForm((prev) => ({ ...prev, ...patch }));

    type SectionStatusState = typeof sectionStatus;

    const updateSectionStatus = useCallback(
        <K extends keyof SectionStatusState>(key: K, value: SectionStatusState[K]) => {
            setSectionStatus((prev) => ({ ...prev, [key]: value }));
        },
        []
    );

    const handleMainStatus = useCallback(
        (ok: boolean) => updateSectionStatus("main", ok),
        [updateSectionStatus]
    );

    const handleDateTimeStatus = useCallback(
        (ok: boolean) => updateSectionStatus("datetime", ok),
        [updateSectionStatus]
    );

    const handleAuditoriumStatus = useCallback(
        (ok: boolean) => updateSectionStatus("auditorium", ok),
        [updateSectionStatus]
    );

    const handleEquipmentStatus = useCallback(
        (ok: boolean) => updateSectionStatus("equipment", ok),
        [updateSectionStatus]
    );

    const handleParticipantsStatus = useCallback(
        (s: { organizer: boolean; participants: boolean }) =>
            updateSectionStatus("participants", s),
        [updateSectionStatus]
    );

    const onSave = async () => {
        try {
            setError(null);

            if (!form.title.trim() || !form.eventType.trim() || !form.roomId.trim()) {
                setError("Заполни обязательные поля: название, тип, аудитория");
                return;
            }

            if (mode === "edit" && bookingId) {
                await updateBooking(bookingId, form);
            } else {
                await createBooking(form);
            }

            onBack();
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "Не удалось сохранить");
        }
    };

    useEffect(() => {
        if (mode !== "edit") return;
        if (!bookingId) return;

        (async () => {
            try {
                setLoading(true);
                setError(null);
                const b = await fetchBookingById(bookingId);

                setForm({
                    title: b.title,
                    eventType: b.eventType,
                    subject: b.subject ?? undefined,
                    format: b.format ?? undefined,
                    description: b.description ?? undefined,
                    startDate: b.startDate,
                    endDate: b.endDate ?? undefined,
                    startTime: b.startTime,
                    endTime: b.endTime,
                    cleanupTime: b.cleanupTime ?? undefined,
                    setupTime: b.setupTime ?? undefined,
                    roomId: b.roomId,
                    backupRoomId: b.backupRoomId ?? undefined,
                    organizerEmail: b.organizerEmail,
                    organizerName: b.organizerName,
                    organizerPhone: b.organizerPhone ?? undefined,
                    organizerPosition: b.organizerPosition ?? undefined,
                    organizerDepartment: b.organizerDepartment ?? undefined,
                    organizerFaculty: b.organizerFaculty ?? undefined,
                    expectedParticipants: b.expectedParticipants,
                    participantType: b.participantType ?? undefined,
                    specialRequirements: b.specialRequirements ?? undefined,
                    equipmentNeeded: b.equipmentNeeded ?? [],
                    additionalComments: b.additionalComments ?? undefined,
                    status: b.status,
                });
            } catch (e: unknown) {
                setError(e instanceof Error ? e.message : "Не удалось загрузить бронирование");
            } finally {
                setLoading(false);
            }
        })();
    }, [mode, bookingId]);

    return (
        <>
            <Title
                mainTitle="Создание нового бронирования"
                secondaryTitle="Заполните все необходимые поля для бронирования аудитории"
                actions={
                    <>
                        <Button variant="third" size="sm" startIcon={<SaveIcon />} onClick={() => onSave()}>
                            Сохранить как черновик
                        </Button>
                        <Button variant="secondary" size="sm" startIcon={<KeyboardReturnIcon />} onClick={() => onBack()}>
                            Назад к списку
                        </Button>
                    </>
                }
            />

            {loading && (
                <Box px="7%" mt={2}>
                    Загрузка...
                </Box>
            )}
            {error && (
                <Box px="7%" mt={2} sx={{ color: "error.main" }}>
                    {error}
                </Box>
            )}

            <Stack direction="row" alignItems="flex-start" spacing={4} px="7%">
                <Box flex={1}>
                    <MainInfoSection
                        onStatusChange={handleMainStatus}
                        value={{ title: form.title, eventType: form.eventType }}
                        onChange={(patch) => setForm((prev) => ({ ...prev, ...patch }))}
                    />
                    <DateTimeSection
                        onStatusChange={handleDateTimeStatus}
                        value={{ startDate: form.startDate, startTime: form.startTime, endTime: form.endTime }}
                        onChange={(patch) => patchForm(patch)}
                    />
                    <AuditoriumSection
                        onStatusChange={handleAuditoriumStatus}
                        value={{ roomId: form.roomId }}
                        onChange={(patch) => patchForm(patch)}
                    />
                    <ParticipantsSection
                        onStatusChange={handleParticipantsStatus}
                        value={{
                            organizerEmail: form.organizerEmail,
                            organizerName: form.organizerName,
                            expectedParticipants: form.expectedParticipants,
                        }}
                        onChange={(patch) => patchForm(patch)}
                    />
                    <EquipmentSection
                        onStatusChange={handleEquipmentStatus}
                        value={{ equipmentNeeded: form.equipmentNeeded }}
                        onChange={(patch) => patchForm(patch)}
                    />
                    <NotificationSection />
                </Box>

                <Box width={370}>
                    <BookingStatus sectionStatus={sectionStatus} />
                    <Tips/>
                    <BookingActions
                        mode={mode}
                        onSave={onSave}
                        onBack={onBack}
                        disabled={!canSave}
                    />
                </Box>
            </Stack>
        </>
    );
};
