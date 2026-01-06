import { Grid } from "@mui/material";
import { StatCard } from "@/components/StatCard/StatCard";
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import ConstructionIcon from '@mui/icons-material/Construction';

export const Statistics = () => {
    return (

        <Grid container spacing={8} sx={{ px: "7%" }}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <StatCard
                    icon={<MeetingRoomIcon sx={{ color: "rgba(55, 99, 227)", fontSize: "24px" }} />}
                    value={24}
                    label="Всего аудиторий"
                    iconBg="rgba(222, 233, 252)"
                    status="+12%"
                    statusColor="success"
                />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <StatCard
                    icon={<CheckCircleIcon sx={{ color: "rgba(23, 163, 74)", fontSize: "24px" }} />}
                    value={18}
                    label="Доступные сейчас"
                    iconBg="rgba(220, 252, 230)"
                    status="Активно"
                    statusColor="success"
                />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <StatCard
                    icon={<EventAvailableIcon sx={{ color: "rgba(233, 162, 59)", fontSize: "24px" }} />}
                    value={6}
                    label="Забронированы"
                    iconBg="rgba(252, 238, 216)"
                    status="Занято"
                    statusColor="warning"
                />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <StatCard
                    icon={<ConstructionIcon sx={{ color: "rgba(136, 58, 225)", fontSize: "24px" }} />}
                    value={156}
                    label="Единиц оборудования"
                    iconBg="rgba(241, 232, 253)"
                    status="Обновлено"
                    statusColor="neutral"
                />
            </Grid>
        </Grid>
    );
}
