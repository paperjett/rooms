import {Box, Checkbox, Stack, Typography} from '@mui/material';
import { type ReactNode } from "react";

interface CheckBoxProps {
    id: string;
    icon?: ReactNode;
    iconColor?: string;
    title: string;
    checked: boolean;
    onChange: (id: string, checked: boolean) => void;
}

export function CheckBox ({id, icon, iconColor, title, checked, onChange}: CheckBoxProps) {
    return(
        <Box
            sx={{
                borderRadius: 2,
                border: "1px solid",
                borderColor: checked ? "#2463eb" : "divider",
                p: 1,
                transition: "border-color 0.7s ease",
            }}
        >
            <Stack direction="row" alignItems="center" spacing={1} pr={1}>
                <Checkbox
                    checked={checked}
                    onChange={(e) => onChange(id, e.target.checked)}
                />
                {icon && (
                    <Box sx={{
                        color: checked ? iconColor : "primary",
                        display: "flex",
                        alignItems: "center",
                        transition: "color 0.7s ease"
                        }}
                    >
                        {icon}
                    </Box>
                )}
                <Typography sx={{ fontSize: 16, color: 'text.primary' }}>
                    {title}
                </Typography>
            </Stack>

        </Box>
    )
}
