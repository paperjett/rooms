import { Box, MenuItem, Select, Stack, Typography } from "@mui/material";
import { FormSection } from "@/components/FormSection";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import React, { useEffect, useState } from "react";

interface AuditoriumSectionProps {
    onStatusChange: (isValid: boolean) => void;

    value: { roomId: string };

    onChange: (patch: Partial<{ roomId: string }>) => void;
}

const ROOM_OPTIONS = ["101", "102", "103", "201"];

export const AuditoriumSection: React.FC<AuditoriumSectionProps> = ({
                                                                        onStatusChange,
                                                                        value,
                                                                        onChange,
                                                                    }) => {
    const [reserved, setReserved] = useState("none");

    useEffect(() => {
        onStatusChange(value.roomId.trim() !== "");
    }, [value.roomId, onStatusChange]);

    return (
        <Box sx={{ maxWidth: 900, mx: "auto", py: 2 }}>
            <FormSection
                title="Выбор аудитории"
                subtitle="Выберите подходящую аудиторию с учётом вместимости и оборудования"
                icon={<MeetingRoomIcon />}
            >
                <Stack direction="row" gap={8}>
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 0.5, flex: 1 }}>
                        <Typography variant="body2" color="text.secondary" pb={1}>
                            Основная аудитория <Box component="span" color="error.main" p={0.2}>*</Box>
                        </Typography>

                        <Select
                            value={value.roomId}
                            onChange={(e) => onChange({ roomId: e.target.value as string })}
                            fullWidth
                            displayEmpty
                        >
                            <MenuItem value="" disabled>
                                Выберите аудиторию
                            </MenuItem>

                            {ROOM_OPTIONS.map((n) => (
                                <MenuItem key={n} value={n}>
                                    {n}
                                </MenuItem>
                            ))}
                        </Select>
                    </Box>

                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 0.5, flex: 1 }}>
                        <Typography variant="body2" color="text.secondary" pb={1}>
                            Резервная аудитория
                        </Typography>

                        <Select
                            value={reserved}
                            onChange={(e) => setReserved(e.target.value as string)}
                            fullWidth
                        >
                            <MenuItem value="none">Не требуется</MenuItem>
                            {ROOM_OPTIONS.filter((x) => x !== value.roomId).map((n) => (
                                <MenuItem key={n} value={n}>
                                    {n}
                                </MenuItem>
                            ))}
                        </Select>

                        <Typography variant="body2" color="textSecondary" fontSize={12}>
                            На случай недоступности аудитории
                        </Typography>
                    </Box>
                </Stack>
            </FormSection>
        </Box>
    );
};
