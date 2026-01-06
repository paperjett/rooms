import React, {useState} from "react";
import {
    Box,
    Typography,
    TextField,
    InputAdornment,
    MenuItem,
    FormControl,
    InputLabel,
    Select, type SelectChangeEvent,
} from "@mui/material";
import { Button } from "@/components/Button/Button";
import SearchIcon from "@mui/icons-material/Search";
import VideocamIcon from '@mui/icons-material/Videocam';
import MonitorIcon from '@mui/icons-material/Monitor';
import PersonalVideoIcon from '@mui/icons-material/PersonalVideo';
import MicIcon from '@mui/icons-material/Mic';
import WifiIcon from '@mui/icons-material/Wifi';

export const SearchFilters = () => {
    const [building, setBuilding] = React.useState('');
    const [floor, setFloor] = React.useState('');
    const [status, setStatus] = React.useState('');
    const [searchText, setSearchText] = React.useState('');

    const equipmentList = [
        { label: "Проектор", icon: <VideocamIcon fontSize="small" /> },
        { label: "Компьютер", icon: <MonitorIcon fontSize="small" /> },
        { label: "Интерактивная доска", icon: <PersonalVideoIcon fontSize="small" /> },
        { label: "Микрофон", icon: <MicIcon fontSize="small" /> },
        { label: "Wi-Fi", icon: <WifiIcon fontSize="small" /> },
    ];

    const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);

    const handleSelectChange =
        (setter: React.Dispatch<React.SetStateAction<string>>) =>
            (event: SelectChangeEvent) =>
                setter(event.target.value as string);

    const toggleEquipment = (item: string) => {
        if (selectedEquipment.includes(item)) {
            setSelectedEquipment(selectedEquipment.filter(i => i !== item));
        } else {
            setSelectedEquipment([...selectedEquipment, item]);
        }
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            sx={{
                px: 4,
                py: 1,
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
                    Фильтры и поиск
                </Typography>
                <Typography
                    component="button"
                    variant="body2"
                    color="text.secondary"
                    sx={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
                >
                    Сбросить все
                </Typography>
            </Box>

            <Box display="flex" gap={2}>
                <TextField
                    id="search-field"
                    label="Поиск по номеру или названию"
                    size="small"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    sx={{ flex: 1 }}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon fontSize="small" sx={{ color: "black" }} />
                                </InputAdornment>
                            ),
                        },
                    }}
                />

                <FormControl size="small" sx={{ flex: 1 }}>
                    <InputLabel id="building-label">Корпус</InputLabel>
                    <Select
                        labelId="building-label"
                        id="building-select"
                        value={building}
                        onChange={handleSelectChange(setBuilding)}
                        label="Корпус"
                    >
                        <MenuItem value="1">Корпус 1</MenuItem>
                        <MenuItem value="2">Корпус 2</MenuItem>
                    </Select>
                </FormControl>

                <FormControl size="small" sx={{ flex: 1}}>
                    <InputLabel id="floor-label">Этаж</InputLabel>
                    <Select
                        labelId="floor-label"
                        id="floor-select"
                        value={floor}
                        onChange={handleSelectChange(setFloor)}
                        label="Этаж"
                    >
                        <MenuItem value="1">Этаж 1</MenuItem>
                        <MenuItem value="2">Этаж 2</MenuItem>
                        <MenuItem value="3">Этаж 3</MenuItem>
                        <MenuItem value="4">Этаж 4</MenuItem>
                    </Select>
                </FormControl>

                <FormControl size="small" sx={{ flex: 1 }}>
                    <InputLabel id="status-label">Статус</InputLabel>
                    <Select
                        labelId="status-label"
                        id="status-select"
                        value={status}
                        onChange={handleSelectChange(setStatus)}
                        label="Статус"
                    >
                        <MenuItem value="available">Доступна</MenuItem>
                        <MenuItem value="booked">Забронирована</MenuItem>
                        <MenuItem value="maintenance">На обслуживании</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            <Box display="flex" gap={1} flexWrap="wrap" sx={{pb:2}}>
                {equipmentList.map(item => (
                    <Button
                        key={item.label}
                        variant={selectedEquipment.includes(item.label) ? "primary" : "secondary"}
                        size="sm"
                        startIcon={item.icon}
                        onClick={() => toggleEquipment(item.label)}
                    >
                        {item.label}
                    </Button>
                ))}
            </Box>
        </Box>
    );
};
