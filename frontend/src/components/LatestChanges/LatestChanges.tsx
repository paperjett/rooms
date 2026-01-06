import AddIcon from '@mui/icons-material/Add';
import UpdateIcon from '@mui/icons-material/Update';
import EventIcon from '@mui/icons-material/Event';
import { Box, Typography, Grid, Stack } from "@mui/material";


export const LatestChanges = () => {

    const changes = [
        {
            title: "Добавлена аудитория 301",
            time: "2 часа назад",
            icon: <AddIcon sx = {{ color: "#17a34a", fontSize: "18px" }} />,
            bgColor: "#dcfce6"
        },
        {
            title: "Обновлено оборудование в аудитории 201",
            time: "4 часа назад",
            icon: <EventIcon sx = {{ color: "#2463eb", fontSize: "18px"}} />,
            bgColor: "#dbe9fe"
        },
        {
            title: "Создано бронирование для аудитории 102",
            time: "6 часов назад",
            icon: <UpdateIcon sx = {{ color: "#f59e0c", fontSize: "18px" }} />,
            bgColor: "#ffedd5"
        }
    ]

    return (
        <Box
            display="flex"
            flexDirection="column"
            sx={{
                px: 4,
                py: 1,
                pb: 3,
                mx: "7%",
                my: 4,
                gap: 3,
                border: "1px solid rgba(0,0,0,0.12)",
                borderRadius: 3,
                bgcolor: "white",
            }}
        >
            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{pt:1}}>
                <Typography fontSize="20px" fontWeight="500" color="text.primary">
                    Последние изменения
                </Typography>
                <Typography
                    component="button"
                    variant="body2"
                    color="text.secondary"
                    sx={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
                >
                    Показать все
                </Typography>
            </Box>
            <Grid container spacing={3} direction="column">
                {changes.map((changes, index) => (
                    <Grid key={index}>
                        <Stack direction="row" spacing={2}>
                            <Box sx={{ bgcolor: changes.bgColor, borderRadius: 6, p: 1.1, display: "flex" }} >
                                {changes.icon}
                            </Box>
                            <Box>
                                <Typography fontSize="12px" fontWeight="500" color="text.primary">
                                    {changes.title}
                                </Typography>
                                <Typography fontSize="10px" color="text.secondary" fontWeight="400">
                                    {changes.time}
                                </Typography>
                            </Box>
                        </Stack>
                    </Grid>
                ))}
            </Grid>
        </Box>
    )
}