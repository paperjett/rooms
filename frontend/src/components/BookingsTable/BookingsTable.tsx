import { useEffect, useState } from "react";
import {
    Box, CircularProgress, IconButton, Paper, Stack, Table, TableBody,
    TableCell, TableHead, TableRow, Typography, Dialog, DialogTitle,
    DialogContent, DialogActions, Button, Chip
} from "@mui/material";
import { DeleteOutline, EditOutlined } from "@mui/icons-material";
import { deleteBooking, fetchActiveBookings, type BookingDto } from "@/api/bookingsApi";

function fmt(dtIso: string) {
    const d = new Date(dtIso);
    return d.toLocaleString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

const STATUS_LABEL: Record<string, string> = {
    PENDING: "Ожидает",
    CONFIRMED: "Подтверждено",
    CANCELLED: "Отменено",
    COMPLETED: "Завершено",
    REJECTED: "Отклонено",
};

export function BookingsTable(props: { onEdit: (id: string) => void }) {
    const [items, setItems] = useState<BookingDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [toDelete, setToDelete] = useState<BookingDto | null>(null);

    const load = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchActiveBookings();
            setItems(data);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "Не удалось загрузить бронирования");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { void load(); }, []);

    if (loading) return <Box sx={{ p: 3, display: "flex", justifyContent: "center" }}><CircularProgress /></Box>;
    if (error) return <Box sx={{ p: 3 }}><Typography color="error">{error}</Typography></Box>;

    return (
        <Box sx={{ border: "1px solid rgba(0,0,0,0.12)", borderRadius: 3, bgcolor: "white", mx: "7%" }}>
            <Typography variant="h6" fontWeight={500} sx={{ p: 2, px: 4, color: "text.primary" }}>
                Активные бронирования
            </Typography>

            <Paper elevation={0} sx={{ borderRadius: 2, overflow: "hidden", border: "1px solid #eef0f3" }}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell width={130}>Аудитория</TableCell>
                            <TableCell>Название</TableCell>
                            <TableCell width={230}>Период</TableCell>
                            <TableCell width={220}>Организатор</TableCell>
                            <TableCell width={140}>Статус</TableCell>
                            <TableCell width={110} align="right">Кол-во участников</TableCell>
                            <TableCell width={120} align="right">Действия</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {items.map((b) => (
                            <TableRow key={b.id} hover>
                                <TableCell>{b.room?.number ?? "—"}</TableCell>
                                <TableCell>{b.title}</TableCell>
                                <TableCell>
                                    <Typography variant="body2">{fmt(b.startTime)}</Typography>
                                    <Typography variant="body2" color="text.secondary">{fmt(b.endTime)}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">{b.organizerName}</Typography>
                                    <Typography variant="caption" color="text.secondary">{b.organizerEmail}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Chip size="small" variant="outlined" label={STATUS_LABEL[b.status] ?? b.status} />
                                </TableCell>
                                <TableCell align="right">{b.expectedParticipants}</TableCell>
                                <TableCell align="right">
                                    <Stack direction="row" justifyContent="flex-end" spacing={1}>
                                        <IconButton size="small" onClick={() => props.onEdit(b.id)} color={"warning"}>
                                            <EditOutlined fontSize="small"/>
                                        </IconButton>
                                        <IconButton size="small" onClick={() => setToDelete(b)} color={"error"}>
                                            <DeleteOutline fontSize="small" />
                                        </IconButton>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}

                        {items.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7}>
                                    <Typography sx={{ py: 3 }} color="text.secondary" align="center">
                                        Активных бронирований пока нет
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Paper>

            <Dialog open={!!toDelete} onClose={() => setToDelete(null)}>
                <DialogTitle>Удалить бронирование?</DialogTitle>
                <DialogContent>
                    <Typography>
                        {toDelete?.title} — действие нельзя отменить.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setToDelete(null)}>Отмена</Button>
                    <Button
                        color="error"
                        variant="contained"
                        onClick={async () => {
                            if (!toDelete) return;
                            await deleteBooking(toDelete.id);
                            setToDelete(null);
                            await load();
                        }}
                    >
                        Удалить
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
