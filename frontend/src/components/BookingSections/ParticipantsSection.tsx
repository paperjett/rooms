import React, { useEffect, useState } from "react";
import { Box, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import { FormSection } from "@/components/FormSection";
import GroupsIcon from "@mui/icons-material/Groups";
import FaceIcon from "@mui/icons-material/Face";

interface ParticipantsSectionProps {
    onStatusChange: (status: { organizer: boolean; participants: boolean }) => void;

    value: {
        organizerEmail: string;
        organizerName: string;
        expectedParticipants: number;
    };

    onChange: (patch: Partial<{
        organizerEmail: string;
        organizerName: string;
        expectedParticipants: number;
    }>) => void;
}

export const ParticipantsSection: React.FC<ParticipantsSectionProps> = ({
                                                                            onStatusChange,
                                                                            value,
                                                                            onChange,
                                                                        }) => {

    const [participantsType, setParticipantsType] = useState("students");

    useEffect(() => {
        const isOrganizerValid = value.organizerEmail.trim() !== "" && value.organizerName.trim() !== "";
        const isParticipantsValid = Number.isFinite(value.expectedParticipants) && value.expectedParticipants > 0;

        onStatusChange({ organizer: isOrganizerValid, participants: isParticipantsValid });
    }, [value.organizerEmail, value.organizerName, value.expectedParticipants, onStatusChange]);

    return (
        <Box sx={{ maxWidth: 900, mx: "auto", my: 2 }}>
            <FormSection
                title="Участники мероприятия"
                subtitle="Укажите информацию об организаторе и участниках"
                icon={<GroupsIcon />}
            >
                <Box
                    sx={{
                        background: "#f9fafb",
                        borderRadius: 2,
                        display: "flex",
                        flexDirection: "column",
                        gap: 0.5,
                        p: 2,
                    }}
                >
                    <Stack direction="row" alignItems="center" spacing={1} pb={2}>
                        <FaceIcon sx={{ color: "#2463eb", fontSize: 24 }} />
                        <Typography sx={{ fontSize: 16, color: "text.primary" }}>
                            Организатор мероприятия
                        </Typography>
                    </Stack>

                    <Stack direction="row" gap={8} pb={3}>
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 0.5, flex: 1 }}>
                            <Typography variant="body2" color="textSecondary" pb={1}>
                                Email <Box component="span" color="error.main" p={0.2}>*</Box>
                            </Typography>
                            <TextField
                                required
                                placeholder="ivanov@university.edu"
                                fullWidth
                                value={value.organizerEmail}
                                onChange={(e) => onChange({ organizerEmail: e.target.value })}
                            />
                        </Box>

                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 0.5, flex: 1 }}>
                            <Typography variant="body2" color="textSecondary" pb={1}>
                                Телефон
                            </Typography>
                            <TextField placeholder="+7 (999) 123-45-67" fullWidth />
                        </Box>
                    </Stack>

                    <Stack direction="row" gap={8} pb={3}>
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 0.5, flex: 1 }}>
                            <Typography variant="body2" color="textSecondary" pb={1}>
                                ФИО организатора <Box component="span" color="error.main" p={0.2}>*</Box>
                            </Typography>
                            <TextField
                                required
                                placeholder="Иванов Иван Иванович"
                                fullWidth
                                value={value.organizerName}
                                onChange={(e) => onChange({ organizerName: e.target.value })}
                            />
                        </Box>

                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 0.5, flex: 1 }}>
                            <Typography variant="body2" color="textSecondary" pb={1}>
                                Должность
                            </Typography>
                            <TextField placeholder="Доцент кафедры математики" fullWidth />
                        </Box>
                    </Stack>

                    <Stack direction="row" gap={8}>
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 0.5, flex: 1 }}>
                            <Typography variant="body2" color="textSecondary" pb={1}>
                                Кафедра/отдел
                            </Typography>
                            <TextField placeholder="Кафедра высшей математики" fullWidth />
                        </Box>

                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 0.5, flex: 1 }}>
                            <Typography variant="body2" color="textSecondary" pb={1}>
                                Факультет
                            </Typography>
                            <TextField placeholder="Математический факультет" fullWidth />
                        </Box>
                    </Stack>
                </Box>

                <Box
                    sx={{
                        background: "#f9fafb",
                        borderRadius: 2,
                        display: "flex",
                        flexDirection: "column",
                        gap: 0.5,
                        p: 2,
                        mt: 3,
                    }}
                >
                    <Stack direction="row" alignItems="center" spacing={1} pb={2}>
                        <GroupsIcon sx={{ color: "#2463eb", fontSize: 24 }} />
                        <Typography sx={{ fontSize: 16, color: "text.primary" }}>
                            Информация об участниках
                        </Typography>
                    </Stack>

                    <Stack direction="row" gap={8} pb={3}>
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 0.5, flex: 1 }}>
                            <Typography variant="body2" color="textSecondary" pb={1}>
                                Ожидаемое количество участников <Box component="span" color="error.main" p={0.2}>*</Box>
                            </Typography>
                            <TextField
                                required
                                placeholder="45"
                                fullWidth
                                type="number"
                                value={String(value.expectedParticipants ?? "")}
                                onChange={(e) =>
                                    onChange({ expectedParticipants: Number(e.target.value) || 0 })
                                }
                            />
                        </Box>

                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 0.5, flex: 1 }}>
                            <Typography variant="body2" color="textSecondary" pb={1}>
                                Тип участников
                            </Typography>
                            <Select
                                value={participantsType}
                                onChange={(e) => setParticipantsType(e.target.value as string)}
                                fullWidth
                            >
                                <MenuItem value="students">Студенты</MenuItem>
                                <MenuItem value="teachers">Преподаватели</MenuItem>
                                <MenuItem value="other">Другое</MenuItem>
                            </Select>
                        </Box>
                    </Stack>

                    <Box display="flex" flexDirection="column" alignItems="flex-start" gap={0.5}>
                        <Typography variant="body2" color="textSecondary" pb={1}>
                            Особое требования к участникам
                        </Typography>
                        <TextField
                            placeholder="Например: требуется предварительная регистрация, необходимы удостоверения личности..."
                            fullWidth
                            multiline
                            rows={3}
                        />
                    </Box>
                </Box>
            </FormSection>
        </Box>
    );
};
