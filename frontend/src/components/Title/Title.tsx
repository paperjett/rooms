import { Box, Typography, Stack} from "@mui/material";
import { type ReactNode } from "react";

export interface TitleProps {
    mainTitle: string;
    secondaryTitle?: string;
    actions?: ReactNode;
}

export function Title({ mainTitle, secondaryTitle, actions}: TitleProps) {
    return (
        <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ px: "7%", py: 3 }}
        >
            <Box>
                <Typography
                    variant="h5"
                    fontWeight={600}
                    color="text.primary"
                    sx={{
                        textAlign: "left",
                    }}
                >
                    {mainTitle}
                </Typography>
                {secondaryTitle && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {secondaryTitle}
                    </Typography>
                )}
            </Box>

            {actions && (
                <Stack direction="row" spacing={1}>
                    {actions}
                </Stack>
            )}
        </Stack>
    );
}

export default Title;
