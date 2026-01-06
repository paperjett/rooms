import React, { useState } from "react";
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Box, Stack, Checkbox, Typography, TextField, FormControlLabel } from "@mui/material";
import { FormSection } from "@/components/FormSection";

export const NotificationSection: React.FC = () => {
    const [checked, setChecked] = useState<string[]>([]);

    const notifications = [
        "Отправить уведомление о создании бронирования",
        "Отправить уведомление об изменении даты/времени",
        "Отправить уведомление об отмене",
        "Отправить уведомление организатору",
        "Отправить уведомление участникам",
    ];

    const handleToggle = (value: string) => {
        setChecked((prev) =>
            prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
        );
    };

    return (
        <Box sx={{ maxWidth: 900, mx: "auto", my: 2 }}>
            <FormSection
                title="Оборудование и требования"
                subtitle="Укажите необходимое оборудование и особые требования к проведению"
                icon={<NotificationsIcon />}
            >
                <Stack direction="column" gap={2}>
                    <Typography variant="body2" color="textSecondary">
                        Настройки уведомлений
                    </Typography>

                    {notifications.map((text, i) => (
                        <FormControlLabel
                            key={i}
                            control={
                                <Checkbox
                                    checked={checked.includes(text)}
                                    onChange={() => handleToggle(text)}
                                />
                            }
                            label={text}
                        />
                    ))}

                    <Box sx={{ pt: 1 }}>
                        <Typography variant="body2" color="textSecondary" pb={1}>
                            Комментарий для администратора
                        </Typography>
                        <TextField
                            placeholder="Дополнительная информация для администратора при рассмотрении заявки..."
                            fullWidth
                            multiline
                            rows={3}
                        />
                    </Box>
                </Stack>
            </FormSection>
        </Box>
    );
};
