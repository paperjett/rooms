import React from "react";
import {Box, Stack, Typography} from "@mui/material";
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import DoneIcon from '@mui/icons-material/Done';

export const Tips: React.FC = () => {

    const tipsText =[
        "Проверьте доступность аудитории на выбранное время",
        "Убедитесь, что вместимость аудитории подходит под выбранное количество участников",
        "Укажите все необходимое оборудование заранее",
        "Добавьте контактную информацию для связи"
    ]

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
            <Stack direction="column" spacing={2}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <TipsAndUpdatesIcon sx={{fontSize:22, color:'#f59e0c'}} />
                    <Typography variant="h6" color="text.primary">
                        Полезные советы
                    </Typography>
                </Stack>
                <Stack direction="column" spacing={2} alignItems="center">
                    {tipsText.map((text, i) => (
                        <Stack key={i} direction="row" spacing={1} alignItems="center">
                            <DoneIcon sx={{ fontSize: 20, color: 'green' }} />
                            <Typography variant="body2" color="textSecondary">
                                {text}
                            </Typography>
                        </Stack>
                    ))}
                </Stack>

            </Stack>

        </Box>
    )
}