import { FormSection } from "@/components/FormSection";
import EventIcon from "@mui/icons-material/Event";
import { Box, Stack, Typography, Select, MenuItem } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs, { Dayjs } from "dayjs";

interface DateTimeSectionProps {
    onStatusChange: (isValid: boolean) => void;

    value: {
        startDate: string; // ISO
        startTime: string; // ISO
        endTime: string;   // ISO
    };

    onChange: (patch: Partial<{ startDate: string; startTime: string; endTime: string }>) => void;
}

export const DateTimeSection: React.FC<DateTimeSectionProps> = ({
                                                                    onStatusChange,
                                                                    value,
                                                                    onChange,
                                                                }) => {
    const [prepareTime, setPrepareTime] = useState("none");
    const [cleanTime, setCleanTime] = useState("none");

    const startDateDayjs = useMemo(() => (value.startDate ? dayjs(value.startDate) : null), [value.startDate]);
    const startTimeDayjs = useMemo(() => (value.startTime ? dayjs(value.startTime) : null), [value.startTime]);
    const endTimeDayjs = useMemo(() => (value.endTime ? dayjs(value.endTime) : null), [value.endTime]);

    useEffect(() => {
        const st = dayjs(value.startTime);
        const et = dayjs(value.endTime);
        const ok =
            !!value.startDate &&
            st.isValid() &&
            et.isValid() &&
            st.isBefore(et);

        onStatusChange(ok);
    }, [value.startDate, value.startTime, value.endTime, onStatusChange]);

    const applyStartDate = (d: Dayjs | null) => {
        if (!d) return;

        const currentTime = dayjs(value.startTime);
        const merged = d
            .hour(currentTime.isValid() ? currentTime.hour() : 0)
            .minute(currentTime.isValid() ? currentTime.minute() : 0)
            .second(0)
            .millisecond(0);

        onChange({
            startDate: d.startOf("day").toISOString(),
            startTime: merged.toISOString(),
        });
    };

    const applyStartTime = (t: Dayjs | null) => {
        if (!t) return;

        const currentDate = dayjs(value.startTime).isValid()
            ? dayjs(value.startTime)
            : dayjs(value.startDate);

        const base = currentDate.isValid() ? currentDate : dayjs();

        const merged = base
            .hour(t.hour())
            .minute(t.minute())
            .second(0)
            .millisecond(0);

        onChange({ startTime: merged.toISOString() });
    };

    const applyEndTime = (t: Dayjs | null) => {
        if (!t) return;

        const base = dayjs(value.startTime).isValid() ? dayjs(value.startTime) : dayjs();

        const merged = base
            .hour(t.hour())
            .minute(t.minute())
            .second(0)
            .millisecond(0);

        onChange({ endTime: merged.toISOString() });
    };

    return (
        <Box sx={{ maxWidth: 900, mx: "auto", my: 2 }}>
            <FormSection
                icon={<EventIcon />}
                title="Дата и время проведения"
                subtitle="Выберите когда и как долго будет проходить мероприятие"
            >
                <Stack direction="row" gap={8} sx={{ pb: 3 }}>
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 0.5, flex: 1 }}>
                        <Typography variant="body2" color="text.secondary" pb={1}>
                            Дата начала <Box component="span" color="error.main" p={0.2}>*</Box>
                        </Typography>

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                slotProps={{ textField: { fullWidth: true, required: true } }}
                                value={startDateDayjs}
                                onChange={applyStartDate}
                            />
                        </LocalizationProvider>
                    </Box>

                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 0.5, flex: 1 }}>
                        <Typography variant="body2" color="text.secondary" pb={1}>
                            Дата окончания
                        </Typography>

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                slotProps={{ textField: { fullWidth: true } }}
                                value={null}
                                onChange={() => {}}
                            />
                        </LocalizationProvider>

                        <Typography variant="body2" color="textSecondary" fontSize={12}>
                            Оставьте пустым для однодневного мероприятия
                        </Typography>
                    </Box>
                </Stack>

                <Stack direction="row" gap={8} sx={{ pb: 3 }}>
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 0.5, flex: 1 }}>
                        <Typography variant="body2" color="text.secondary" pb={1}>
                            Время начала <Box component="span" color="error.main" p={0.2}>*</Box>
                        </Typography>

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <TimePicker
                                slotProps={{ textField: { fullWidth: true, required: true } }}
                                value={startTimeDayjs}
                                onChange={applyStartTime}
                            />
                        </LocalizationProvider>
                    </Box>

                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 0.5, flex: 1 }}>
                        <Typography variant="body2" color="text.secondary" pb={1}>
                            Время окончания <Box component="span" color="error.main" p={0.2}>*</Box>
                        </Typography>

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <TimePicker
                                slotProps={{ textField: { fullWidth: true, required: true } }}
                                value={endTimeDayjs}
                                onChange={applyEndTime}
                            />
                        </LocalizationProvider>
                    </Box>
                </Stack>

                <Stack direction="row" gap={8}>
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 0.5, flex: 1 }}>
                        <Typography variant="body2" color="text.secondary" pb={1}>
                            Время подготовки
                        </Typography>
                        <Select value={prepareTime} onChange={(e) => setPrepareTime(e.target.value as string)} fullWidth>
                            <MenuItem value="none">Не требуется</MenuItem>
                            <MenuItem value="5min">5 минут</MenuItem>
                            <MenuItem value="10min">10 минут</MenuItem>
                            <MenuItem value="15min">15 минут</MenuItem>
                            <MenuItem value="20min">20 минут</MenuItem>
                            <MenuItem value="25min">25 минут</MenuItem>
                            <MenuItem value="30min">30 минут</MenuItem>
                        </Select>
                        <Typography variant="body2" color="textSecondary" fontSize={12}>
                            Время для подготовки аудитории перед мероприятием
                        </Typography>
                    </Box>

                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 0.5, flex: 1 }}>
                        <Typography variant="body2" color="text.secondary" pb={1}>
                            Время уборки
                        </Typography>
                        <Select value={cleanTime} onChange={(e) => setCleanTime(e.target.value as string)} fullWidth>
                            <MenuItem value="none">Не требуется</MenuItem>
                            <MenuItem value="5min">5 минут</MenuItem>
                            <MenuItem value="10min">10 минут</MenuItem>
                            <MenuItem value="15min">15 минут</MenuItem>
                            <MenuItem value="20min">20 минут</MenuItem>
                            <MenuItem value="25min">25 минут</MenuItem>
                            <MenuItem value="30min">30 минут</MenuItem>
                        </Select>
                        <Typography variant="body2" color="textSecondary" fontSize={12}>
                            Время для уборки аудитории после мероприятия
                        </Typography>
                    </Box>
                </Stack>
            </FormSection>
        </Box>
    );
};
