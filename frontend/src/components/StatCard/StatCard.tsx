import React from "react";
import { Card, Box, Typography, Chip } from "@mui/material";
import type { SxProps } from "@mui/system";
import type { Theme } from "@mui/material/styles";

export interface StatCardProps {
    icon: React.ReactNode;
    value: number;
    label: string;
    iconBg?: string;
    status?: string;
    statusColor?: "success" | "warning" | "neutral";
    sx?: SxProps<Theme>;
}


export const StatCard = ({
                             icon,
                             value,
                             label,
                             iconBg,
                             status,
                             statusColor,
                             sx }: StatCardProps) => {
    return (
        <Card
            elevation={0}
            sx={{
                border: "1px solid rgba(0,0,0,0.12)",
                borderRadius: 3,
                p: 3,
                width: 220,
                height: 110,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                ...sx,
            }}
        >
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box
                    sx={{
                        bgcolor: iconBg,
                        borderRadius: 2,
                        p: 1.3,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    {icon}
                </Box>

                {status && (
                    <Chip
                        label={status}
                        size="small"
                        sx={{
                            fontWeight: 500,
                            fontSize: "12px",
                            bgcolor:
                                statusColor === "success"
                                    ? "rgba(226, 251, 232)"
                                    : statusColor === "warning"
                                        ? "rgba(252, 238, 216)"
                                        : "rgba(243, 244, 246)",
                            color:
                                statusColor === "success"
                                    ? "success.main"
                                    : statusColor === "warning"
                                        ? "warning.main"
                                        : "text.secondary",
                        }}
                    />
                )}
            </Box>

            <Box sx={{ textAlign: "left", px: 0.5}}>
                <Typography variant="h5" fontWeight={600} sx={{ lineHeight: 1 }}>
                    {value}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
                    {label}
                </Typography>
            </Box>
        </Card>

    );
};
