import { useState } from 'react'
import { Header } from './components/Header';
import { AuditoriumCatalog } from '@/pages/AuditoriumCatalog.tsx';
import {BookingManagment} from "@/pages/BookingManagment.tsx";

import './App.css'

type BookingScreenState =
    | { mode: "create" }
    | { mode: "edit"; id: string };

function App() {
    const [active, setActive] = useState<"catalog" | "bookings">("catalog");
    const [bookingState, setBookingState] = useState<BookingScreenState>({ mode: "create" });
    return (
        <>
            <Header
                activeNavId={active}
                onNavigate={(id) => setActive(id as "catalog" | "bookings")}
                onBellClick={() => console.log("bell")}
            />
            <main style={{ paddingTop: '60px' }}>
                {active === "catalog" && (
                    <AuditoriumCatalog
                        onCreateBooking={() => {
                            setBookingState({ mode: "create" });
                            setActive("bookings");
                            window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        onEditBooking={(id) => {
                            setBookingState({ mode: "edit", id });
                            setActive("bookings");
                            window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                    />
                )}
                {active === "bookings" && (
                    <BookingManagment
                        mode={bookingState.mode}
                        bookingId={bookingState.mode === "edit" ? bookingState.id : undefined}
                        onBack={() => setActive("catalog")}
                    />
                )}
            </main>
        </>
    );
}

export default App;