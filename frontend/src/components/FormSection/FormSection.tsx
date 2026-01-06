import { Box, Typography, Stack, Paper } from "@mui/material";
import type {ReactNode} from "react";

interface FormSectionProps {
    icon?: ReactNode;
    title: string;
    subtitle?: string;
    children: ReactNode;
}

export function FormSection({ icon, title, subtitle, children}: FormSectionProps) {
    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
                mb: 3
            }}
        >
            <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                {icon && (
                    <Box
                        sx={{
                            color: "white",
                            background: "#2463eb",
                            p: 1,
                            display: "flex",
                            alignItems: "center",
                            borderRadius: 2
                        }}
                    >
                        {icon}
                    </Box>
                )}
                <Box>
                    <Typography variant="h6" fontWeight={500}>
                        {title}
                    </Typography>
                    {subtitle && (
                        <Typography variant="body2" color="text.secondary">
                            {subtitle}
                        </Typography>
                    )}
                </Box>
            </Stack>

            <Box>{children}</Box>
        </Paper>
    );
}
