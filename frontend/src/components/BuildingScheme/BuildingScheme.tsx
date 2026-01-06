import * as React from "react";
import {
    Box,
    Typography,
    Tabs,
    Tab,
    Stack,
} from "@mui/material";

interface Room {
    id: number;
    number: string;
    status: "available" | "booked" | "maintenance";
}

interface Floor {
    floor: number;
    rooms: Room[];
}

interface Building {
    name: string;
    floors: Floor[];
}

const buildings: Building[] = [
    {
        name: "Корпус 1",
        floors: [
            {
                floor: 4,
                rooms: [
                    { id: 401, number: "401", status: "available" },
                    { id: 402, number: "402", status: "maintenance" },
                    { id: 403, number: "403", status: "booked" },
                    { id: 404, number: "404", status: "available" },
                ],
            },
            {
                floor: 3,
                rooms: [
                    { id: 301, number: "301", status: "available" },
                    { id: 302, number: "302", status: "available" },
                    { id: 303, number: "303", status: "booked" },
                    { id: 304, number: "304", status: "available" },
                ],
            },
            {
                floor: 2,
                rooms: [
                    { id: 201, number: "201", status: "available" },
                    { id: 202, number: "202", status: "booked" },
                    { id: 203, number: "203", status: "maintenance" },
                    { id: 204, number: "204", status: "available" },
                ],
            },
            {
                floor: 1,
                rooms: [
                    { id: 101, number: "101", status: "available" },
                    { id: 102, number: "102", status: "booked" },
                    { id: 103, number: "103", status: "available" },
                    { id: 104, number: "104", status: "available" },
                ],
            },
        ],
    },
    {
        name: "Корпус 2",
        floors: [
            {
                floor: 2,
                rooms: [
                    { id: 201, number: "201", status: "booked" },
                    { id: 202, number: "202", status: "available" },
                    { id: 203, number: "203", status: "maintenance" },
                ],
            },
            {
                floor: 1,
                rooms: [
                    { id: 101, number: "101", status: "available" },
                    { id: 102, number: "102", status: "booked" },
                    { id: 103, number: "103", status: "available" },
                ],
            },
        ],
    },
];

export const BuildingScheme = () => {
    const [tab, setTab] = React.useState(0);

    const handleChange = (_: React.SyntheticEvent, newValue: number) =>
        setTab(newValue);

    const currentBuilding = buildings[tab];

    const getStatusColor = (status: string) => {
        switch (status) {
            case "available":
                return "#bbf7d0";
            case "booked":
                return "#fed8aa";
            case "maintenance":
                return "#e5e7eb";
            default:
                return "#fafafa";
        }
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                px: 4,
                py: 3,
                mx: "7%",
                my: 4,
                border: "1px solid rgba(0,0,0,0.12)",
                borderRadius: 3,
                bgcolor: "white",
            }}
        >
            <Typography fontSize="20px" fontWeight="500" color="text.primary" mb={2}>
                Схема корпусов
            </Typography>

            <Tabs
                value={tab}
                onChange={handleChange}
                textColor="primary"
                indicatorColor="primary"
                sx={{
                    mb: 3,
                    "& .MuiTab-root": {
                        textTransform: "none",
                        fontWeight: 500,
                        minWidth: "auto",
                        px: 2,
                    },
                }}
            >
                {buildings.map((b, index) => (
                    <Tab key={index} label={b.name} />
                ))}
            </Tabs>

            <Box
                sx={{
                    display: "flex",
                    gap: 4,
                    alignItems: "flex-start",
                }}
            >

                <Box sx={{ flex: "0 0 70%", bgcolor: "#f9fafb", borderRadius: 2, p:2 }}>
                    {currentBuilding.floors.map((floor) => (
                        <Box
                            key={floor.floor}
                            sx={{
                                mb: floor.floor === currentBuilding.floors[currentBuilding.floors.length - 1].floor ? 0 : 3,
                                p: 2,
                                border: "1px dashed rgba(0,0,0,0.12)",
                                borderRadius: 2,
                            }}
                        >
                            <Typography
                                fontSize="14px"
                                fontWeight="600"
                                color="text.secondary"
                                mb={1}
                            >
                                {floor.floor} этаж
                            </Typography>

                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    flexWrap: "wrap",
                                    gap: 1,
                                }}
                            >
                                {floor.rooms.map((room) => (
                                    <Box
                                        key={room.id}
                                        sx={{
                                            flex: "1 1 calc(25% - 8px)",
                                            minWidth: "100px",
                                            maxWidth: "120px",
                                            bgcolor: getStatusColor(room.status),
                                            border: "1px solid rgba(0,0,0,0.08)",
                                            borderRadius: 1,
                                            py: 1,
                                            textAlign: "center",
                                            color: "text.primary",
                                            fontSize: 14,
                                            fontWeight: 500,
                                            transition: "all 0.2s",
                                            "&:hover": {
                                                transform: "translateY(-2px)",
                                                boxShadow: 1,
                                            },
                                        }}
                                    >
                                        {room.number}
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    ))}
                </Box>

                <Box sx={{ flex: "0 0 30%" }}>
                    <Typography
                        fontSize="16px"
                        fontWeight="500"
                        mb={1}
                        color="text.primary"
                    >
                        Легенда
                    </Typography>

                    <Stack spacing={1.2} mb={3}>
                        {[
                            { color: "#bbf7d0", label: "Доступна" },
                            { color: "#fed8aa", label: "Забронирована" },
                            { color: "#e5e7eb", label: "На обслуживании" },
                        ].map((item, i) => (
                            <Stack key={i} direction="row" alignItems="center" spacing={1}>
                                <Box
                                    sx={{
                                        width: 16,
                                        height: 16,
                                        bgcolor: item.color,
                                        borderRadius: 0.5,
                                        border: "1px solid rgba(0,0,0,0.1)",
                                    }}
                                />
                                <Typography fontSize="14px" color="text.secondary">
                                    {item.label}
                                </Typography>
                            </Stack>
                        ))}
                    </Stack>

                    <Typography
                        fontSize="16px"
                        fontWeight="500"
                        mb={1}
                        color="text.primary"
                    >
                        Статистика по этажам
                    </Typography>

                    <Stack spacing={0.6}>
                        {currentBuilding.floors.map((f) => {
                            const total = f.rooms.length;
                            const available = f.rooms.filter(
                                (r) => r.status === "available"
                            ).length;
                            return (
                                <Typography
                                    key={f.floor}
                                    fontSize="13px"
                                    color="text.secondary"
                                >
                                    {f.floor} этаж — {available}/{total} доступно
                                </Typography>
                            );
                        })}
                    </Stack>
                </Box>
            </Box>
        </Box>
    );
};
