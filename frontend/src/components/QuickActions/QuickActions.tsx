import * as React from "react";
import {
    Box,
    Grid,
    Stack,
    Typography,
    ButtonBase,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import ConstructionIcon from '@mui/icons-material/Construction';

export interface QuickActionsProps {
    onAddAuditorium?: () => void;
    onCreateBooking?: () => void;
    onEditAuditorium?: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
                                                              onAddAuditorium,
                                                              onCreateBooking,
                                                              onEditAuditorium,
                                                          }) => {

    const actions = [
        {
            label: "Добавить аудиторию",
            description: "Создать новую аудиторию",
            icon: <AddIcon sx={{ color: "#476fe5" }} />,
            bg: "#dee9fc",
            onClick: onAddAuditorium,
        },
        {
            label: "Создать бронирование",
            description: "Забронировать аудиторию",
            icon: <EventAvailableIcon sx={{ color: "#4ca154"}} />,
            bg: "#e2fbe8",
            onClick: onCreateBooking,
        },
        {
            label: "Массовое редактирование",
            description: "Изменить несколько аудиторий",
            icon: <ConstructionIcon sx={{ color: "#e9a23b" }} />,
            bg: "#fceed8",
            onClick: onEditAuditorium,
        },
    ];

    return (
        <Box
            display="flex"
            flexDirection="column"
            sx={{
                px: 4,
                py: 3,
                mx: "7%",
                my: 4,
                gap: 3,
                border: "1px solid rgba(0,0,0,0.12)",
                borderRadius: 3,
                bgcolor: "white"
            }}
        >
            <Typography fontSize="20px" fontWeight="500" color="text.primary">
                Быстрые действия
            </Typography>

            <Grid container spacing={3}>
                {actions.map((action, index) => (
                    <Grid key={index} sx={{flex: 1}}>
                        <ButtonBase
                            component="div"
                            onClick={action.onClick}
                            sx={{
                                width: "100%",
                                textAlign: "left",
                                justifyContent: "flex-start",
                                p: 2,
                                borderRadius: 2,
                                border: "1px solid rgba(0,0,0,0.12)",
                                transition: "all 0.2s ease",
                                bgcolor: "white",
                                "&:hover": {
                                    borderColor: "#dcdcdc",
                                    transform: "translateY(-1px)",
                                    bgcolor: "#f9f9f9",
                                },
                            }}
                        >
                            <Stack direction="row" spacing={2}>
                                <Box sx={{ bgcolor: action.bg, borderRadius: 2, p: 1.1, display: "flex" }} >
                                    {action.icon}
                                </Box>

                                <Box>
                                    <Typography fontSize="14px" fontWeight="500" color="text.primary">
                                        {action.label}
                                    </Typography>
                                    <Typography fontSize="13px" color="text.secondary" fontWeight="400">
                                        {action.description}
                                    </Typography>
                                </Box>
                            </Stack>
                        </ButtonBase>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};
