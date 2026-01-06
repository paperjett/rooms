import React, { useEffect } from "react";
import { Box, TextField, Typography } from "@mui/material";
import { FormSection } from "@/components/FormSection";
import { CheckBox } from "@/components/CheckBox";
import ConnectedTvIcon from "@mui/icons-material/ConnectedTv";
import MicIcon from "@mui/icons-material/Mic";
import ComputerIcon from "@mui/icons-material/Computer";
import PersonalVideoIcon from "@mui/icons-material/PersonalVideo";
import VideocamIcon from "@mui/icons-material/Videocam";
import WifiIcon from "@mui/icons-material/Wifi";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import ScienceIcon from "@mui/icons-material/Science";
import HandymanIcon from "@mui/icons-material/Handyman";

const options = [
    { id: "projector", icon: <ConnectedTvIcon />, title: "Проектор", iconColor: "#2865eb" },
    { id: "mic", icon: <MicIcon />, title: "Микрофон", iconColor: "#17a34a" },
    { id: "pc", icon: <ComputerIcon />, title: "Компьютер", iconColor: "#f59e0c" },
    { id: "desk", icon: <PersonalVideoIcon />, title: "Интерактивная доска", iconColor: "#dc2625" },
    { id: "video", icon: <VideocamIcon />, title: "Видеосвязь", iconColor: "#9334e9" },
    { id: "wifi", icon: <WifiIcon />, title: "Wi-Fi", iconColor: "#2a67eb" },
    { id: "ac", icon: <AcUnitIcon />, title: "Кондиционер", iconColor: "#0a91b3" },
    { id: "sound", icon: <VolumeUpIcon />, title: "Звуковая система", iconColor: "#ea580b" },
    { id: "lab", icon: <ScienceIcon />, title: "Лабораторное оборудование", iconColor: "#17a34a" },
];

interface EquipmentSectionProps {
    onStatusChange: (isValid: boolean) => void;

    value: { equipmentNeeded: string[] };

    onChange: (patch: Partial<{ equipmentNeeded: string[] }>) => void;
}

export const EquipmentSection: React.FC<EquipmentSectionProps> = ({
                                                                      onStatusChange,
                                                                      value,
                                                                      onChange,
                                                                  }) => {
    useEffect(() => {
        onStatusChange(true);
    }, [onStatusChange]);

    const handleChange = (id: string, isChecked: boolean) => {
        const next = isChecked
            ? Array.from(new Set([...value.equipmentNeeded, id]))
            : value.equipmentNeeded.filter((item) => item !== id);

        onChange({ equipmentNeeded: next });
    };

    return (
        <Box sx={{ maxWidth: 900, mx: "auto", my: 2 }}>
            <FormSection
                title="Оборудование и требования"
                subtitle="Укажите необходимое оборудование и особые требования к проведению"
                icon={<HandymanIcon />}
            >
                <Typography variant="body2" color="textSecondary">
                    Необходимое техническое оборудование
                </Typography>

                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gap: 2,
                        py: 2,
                        alignItems: "center",
                    }}
                >
                    {options.map((opt) => (
                        <CheckBox
                            key={opt.id}
                            id={opt.id}
                            icon={opt.icon}
                            iconColor={opt.iconColor}
                            title={opt.title}
                            checked={value.equipmentNeeded.includes(opt.id)}
                            onChange={handleChange}
                        />
                    ))}
                </Box>

                <Box display="flex" flexDirection="column" alignItems="flex-start" gap={0.5}>
                    <Typography variant="body2" color="textSecondary" pb={1}>
                        Дополнительные требования и комментарии
                    </Typography>
                    <TextField
                        placeholder="Укажите любые дополнительные требования: особая температура, освещение..."
                        fullWidth
                        multiline
                        rows={3}
                    />
                </Box>
            </FormSection>
        </Box>
    );
};
