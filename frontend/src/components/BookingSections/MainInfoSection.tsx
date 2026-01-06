import { FormSection } from "@/components/FormSection";
import InfoIcon from "@mui/icons-material/Info";
import { Box, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

interface MainInfoSectionProps {
    onStatusChange: (isValid: boolean) => void;

    value: {
        title: string;
        eventType: string;
    };

    onChange: (patch: Partial<{ title: string; eventType: string }>) => void;
}

export const MainInfoSection: React.FC<MainInfoSectionProps> = ({
                                                                    onStatusChange,
                                                                    value,
                                                                    onChange,
                                                                }) => {
    const [eventFormat, setEventFormat] = useState("inperson");

    useEffect(() => {
        const isValid = value.title.trim() !== "" && value.eventType.trim() !== "";
        onStatusChange(isValid);
    }, [value.title, value.eventType, onStatusChange]);

    return (
        <Box sx={{ maxWidth: 900, mx: "auto", my: 2 }}>
            <FormSection
                icon={<InfoIcon />}
                title="Основная информация о мероприятии"
                subtitle="Укажите детали мероприятия и тип занятия"
            >
                <Stack direction="row" gap={8} sx={{ pb: 3 }}>
                    <Box display="flex" flexDirection="column" alignItems="flex-start" gap={0.5} flex={1}>
                        <Typography variant="body2" color="textSecondary" pb={1}>
                            Название мероприятия
                            <Box component="span" color="error.main" p={0.2}>
                                *
                            </Box>
                        </Typography>

                        <TextField
                            required
                            placeholder="Например: Лекция по высшей математике"
                            fullWidth
                            value={value.title}
                            onChange={(e) => onChange({ title: e.target.value })}
                        />

                        <Typography variant="body2" color="textSecondary" fontSize={12}>
                            Краткое и понятное название мероприятия
                        </Typography>
                    </Box>

                    <Box display="flex" flexDirection="column" alignItems="flex-start" gap={0.5} flex={1}>
                        <Typography variant="body2" color="textSecondary" pb={1}>
                            Тип мероприятия
                            <Box component="span" color="error.main" p={0.2}>
                                *
                            </Box>
                        </Typography>

                        <Select
                            value={value.eventType}
                            onChange={(e) => onChange({ eventType: e.target.value as string })}
                            fullWidth
                        >
                            <MenuItem value="lecture">Лекция</MenuItem>
                            <MenuItem value="seminar">Семинар</MenuItem>
                        </Select>
                    </Box>
                </Stack>

                <Stack direction="row" gap={8} sx={{ pb: 3 }}>
                    <Box display="flex" flexDirection="column" alignItems="flex-start" gap={0.5} flex={1}>
                        <Typography variant="body2" color="textSecondary" pb={1}>
                            Предмет/дисциплина
                        </Typography>
                        <TextField placeholder="Например: Высшая математика" fullWidth />
                        <Typography variant="body2" color="textSecondary" fontSize={12}>
                            Название учебной дисциплины или предмета
                        </Typography>
                    </Box>

                    <Box display="flex" flexDirection="column" alignItems="flex-start" gap={0.5} flex={1}>
                        <Typography variant="body2" color="textSecondary" pb={1}>
                            Формат проведения
                        </Typography>
                        <Select
                            value={eventFormat}
                            onChange={(e) => setEventFormat(e.target.value as string)}
                            fullWidth
                        >
                            <MenuItem value="inperson">Очно</MenuItem>
                            <MenuItem value="inabsentia">Заочно</MenuItem>
                        </Select>
                    </Box>
                </Stack>

                <Box display="flex" flexDirection="column" alignItems="flex-start" gap={0.5}>
                    <Typography variant="body2" color="textSecondary" pb={1}>
                        Описание мероприятия
                    </Typography>
                    <TextField
                        placeholder="Подробное описание мероприятия, цели, особенности проведения..."
                        fullWidth
                        multiline
                        rows={5}
                    />
                    <Typography variant="body2" color="textSecondary" fontSize={12}>
                        Дополнительная информация о содержании и целях мероприятия
                    </Typography>
                </Box>
            </FormSection>
        </Box>
    );
};
