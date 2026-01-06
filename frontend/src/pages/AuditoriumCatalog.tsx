import React from "react";
import { Title } from "@/components/Title";
import { Button } from "@/components/Button";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import AddIcon from '@mui/icons-material/Add';
import {Statistics} from "@/components/Statistics";
import {SearchFilters} from "@/components/SearchFilters";
import {BookingsTable} from "@/components/BookingsTable/BookingsTable.tsx";
import {QuickActions} from "@/components/QuickActions";
import {LatestChanges} from "@/components/LatestChanges";
import {EquipmentOverview} from "@/components/EquipmentOverview";
import {BuildingScheme} from "@/components/BuildingScheme";
import {Footer} from "@/components/Footer";

export const AuditoriumCatalog: React.FC<{
    onCreateBooking: () => void;
    onEditBooking: (id: string) => void;
}> = ({ onCreateBooking, onEditBooking }) => {
    return (
        <>
           <Title
               mainTitle="Каталог аудиторий"
               secondaryTitle="Управляйте информацией об аудиториях, их оборудованием и местоположением"
               actions={
               <>
               <Button
                   startIcon={<FileDownloadIcon fontSize="small" />}
                   variant="secondary"
                   size="sm"
               >
                   Экспорт JSON
               </Button>
               <Button
                   startIcon={<FileUploadIcon fontSize="small" />}
                   variant="secondary"
                   size="sm"
               >
                   Импорт JSON
               </Button>
               <Button
                   startIcon={<AddIcon fontSize="small" />}
                   variant="primary"
                   size="sm"
               >
                   Добавить аудиторию
               </Button>
               </>
               }
           >
           </Title>
            <Statistics/>
            <SearchFilters />
            <BookingsTable onEdit={onEditBooking} />
            <QuickActions onCreateBooking={onCreateBooking} />
            <LatestChanges />
            <EquipmentOverview />
            <BuildingScheme />
            <Footer />
        </>
    );
};

export default AuditoriumCatalog;
