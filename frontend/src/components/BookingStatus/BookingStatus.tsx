import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";
import ChecklistIcon from "@mui/icons-material/Checklist";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

interface BookingStatusProps {
    sectionStatus: {
        main: boolean;
        datetime: boolean;
        auditorium: boolean;
        participants: {
            organizer: boolean;
            participants: boolean;
        };
        equipment: boolean;
    };
}

export const BookingStatus: React.FC<BookingStatusProps> = ({ sectionStatus }) => {

    const statuses = [
        { key: "main", label: "Основная информация", value: sectionStatus.main },
        { key: "datetime", label: "Дата и время", value: sectionStatus.datetime },
        { key: "auditorium", label: "Выбор аудитории", value: sectionStatus.auditorium },
        { key: "organizer", label: "Организатор", value: sectionStatus.participants.organizer },
        { key: "participants", label: "Участники", value: sectionStatus.participants.participants },
        { key: "equipment", label: "Оборудование", value: sectionStatus.equipment },
    ];

    const allValid = statuses.every((s) => s.value);

    return (
        <Box
            sx={{
                p: 3,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
                mx: "auto",
                my: 2,
                backgroundColor: "white",
            }}
        >
            <Typography variant="h6" color="text.primary" pb={2}>
                Статус заполнения
            </Typography>

            <Stack direction="column" spacing={1.5} pb={2}>
                {statuses.map((s) => (
                    <Stack
                        key={s.key}
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <Typography color="text.secondary">
                            {s.label}
                        </Typography>
                        {s.value ? (
                            <CheckCircleIcon sx={{ color: "#17a34a", fontSize: 24 }} />
                        ) : (
                            <ErrorIcon sx={{ color: "#f59e0c", fontSize: 24 }} />
                        )}
                    </Stack>
                ))}
            </Stack>

            {allValid ? (
                <Box
                    sx={{
                        p: 1,
                        borderRadius: 2,
                        backgroundColor: "#effdf4",
                    }}
                >
                    <Stack direction="row" gap={1.5} alignItems="center">
                        <ChecklistIcon sx={{ color: "#17a34a", fontSize: 22 }} />
                        <Typography fontSize={14} color="#17a34a">
                            Все поля заполнены
                        </Typography>
                    </Stack>
                </Box>
            ) : (
                <Box
                    sx={{
                        p: 1,
                        borderRadius: 2,
                        backgroundColor: "#fefce8",
                    }}
                >
                    <Stack direction="row" gap={1.5} alignItems="center">
                        <WarningIcon sx={{ color: "#f59e0c", fontSize: 22 }} />
                        <Typography fontSize={14} color="#f59e0c">
                            Заполните обязательные поля
                        </Typography>
                    </Stack>
                </Box>
            )}
        </Box>
    );
};
