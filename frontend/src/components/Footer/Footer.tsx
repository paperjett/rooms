import {Box, Typography} from "@mui/material";
import { Button } from "@/components/Button/Button";

export const Footer = () => {
    return (
        <Box
            sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            px: 4,
            py: 2.5,
            mx: "7%",
            my: 4,
            border: "1px solid rgba(0,0,0,0.12)",
            borderRadius: 3,
            bgcolor: "#2259e2"
        }}>
            <Box display="flex" flexDirection="column">
                <Typography fontSize={18} fontWeight={600} sx = {{color: 'white', pb: 1}}>
                    Нужна помощь?
                </Typography>
                <Typography variant="body2" color="white">
                    Ознакомьтесь с документацией или свяжитесь с поддержкой
                </Typography>
            </Box>
            <Box display="flex" flexDirection="row" gap={3} alignItems="center">
                <Button size="sm" variant="secondary">
                    Документация
                </Button>
                <Button size="sm" variant="primary">
                    Связаться с поддержкой
                </Button>
            </Box>
        </Box>
    )
}