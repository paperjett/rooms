import VideocamIcon from '@mui/icons-material/Videocam';
import TvIcon from '@mui/icons-material/Tv';
import PersonalVideoIcon from '@mui/icons-material/PersonalVideo';
import MicIcon from '@mui/icons-material/Mic';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import CastIcon from '@mui/icons-material/Cast';
import { Box, Typography, Stack } from "@mui/material";


export const EquipmentOverview = () => {

    const equipment = [
        {
            name: "Проекторы",
            value: 18,
            icon: <CastIcon sx={{color: "#4278ed"}}/>,
            bgColor: "#dbe9fe"
        },
        {
            name: "Компьютеры",
            value: 45,
            icon: <TvIcon sx={{color: "#17a34a"}}/>,
            bgColor: "#dcfce6"
        },
        {
            name: "Интер. доски",
            value: 12,
            icon: <PersonalVideoIcon sx={{color: "#973bea"}}/>,
            bgColor: "#f3e8ff"
        },
        {
            name: "Микрофоны",
            value: 24,
            icon: <MicIcon sx={{color: "#f59e0c"}}/>,
            bgColor: "#ffedd5"
        },
        {
            name: "Камеры",
            value: 8,
            icon: <VideocamIcon sx={{color: "#dc2625"}}/>,
            bgColor: "#fee2e1"
        },
        {
            name: "Кондиционеры",
            value: 16,
            icon: <AcUnitIcon sx={{color: "#ca8b06"}}/>,
            bgColor: "#fef9c3"
        }
    ]

    return (
        <Box
            display="flex"
            flexDirection="column"
            sx={{
                px: 4,
                pb: 3,
                pt: 2,
                mx: "7%",
                my: 4,
                gap: 3,
                border: "1px solid rgba(0,0,0,0.12)",
                borderRadius: 3,
                bgcolor: "white",
            }}
        >
            <Typography fontSize="20px" fontWeight="500" color="text.primary">
                Обзор оборудования
            </Typography>
            <Stack direction="row" sx={{ width: "100%" }}>
                {equipment.map((item, index) => (
                    <Box
                        key={index}
                        sx={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        <Box sx={{ bgcolor: item.bgColor, borderRadius: 2, p: 1.5, mb: 1, display: "flex" }}>
                            {item.icon}
                        </Box>
                        <Typography fontSize="18px" fontWeight="600" color="text.primary" lineHeight={1.2}>
                            {item.value}
                        </Typography>
                        <Typography fontSize="14px" color="text.secondary" fontWeight="400">
                            {item.name}
                        </Typography>
                    </Box>
                ))}
            </Stack>
        </Box>
    )
}