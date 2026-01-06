import React from "react";
import { Box, Stack } from "@mui/material";
import { Button } from "@/components/Button";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";

interface BookingActionsProps {
    mode: "create" | "edit";
    onSave: () => void;
    onBack: () => void;
    disabled?: boolean;
}

export const BookingActions: React.FC<BookingActionsProps> = ({
                                                                  mode,
                                                                  onSave,
                                                                  onBack,
                                                                  disabled,
                                                              }) => {
    return (
        <Box
            sx={{
                p: 3,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
                mx: "auto",
                my: 2,
                backgroundColor: "white",
            }}
        >
            <Stack direction="column" spacing={2}>
                <Button
                    variant="primary"
                    startIcon={<SaveIcon />}
                    onClick={onSave}
                    disabled={disabled}
                >
                    {mode === "create" ? "Создать бронирование" : "Сохранить изменения"}
                </Button>

                <Button
                    variant="third"
                    startIcon={<SaveIcon />}
                    onClick={() => {
                        // пока заглушка
                        console.log("save draft");
                    }}
                >
                    Сохранить как черновик
                </Button>

                <Button
                    variant="secondary"
                    startIcon={<CloseIcon />}
                    onClick={onBack}
                >
                    Отмена
                </Button>
            </Stack>
        </Box>
    );
};
