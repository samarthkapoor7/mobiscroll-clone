import React, { useState } from "react";
import { Event, Resource } from "../types";
import { ChevronLeft } from "lucide-react";


interface CalendarProps {
    events: Event[];
    resources: Resource[];
    onEventAdd: (event: Event) => void;
    onEventUpdate: (event: Event) => void;
    onEventDelete: (eventId: string) => void;
    onResourceAdd: (resource: Resource) => void;
}

const Calendar: React.FC<CalendarProps> = ({
    events,
    resources,
    onEventAdd,
    onEventUpdate,
    onEventDelete,
    onResourceAdd,
}) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    return (
        <div className="flex flex-col h-screen">
            <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-4">
                    <button
                      onClick={handlePrevMonth}
                      className="p-2 hover:bg-gray-100 rounded"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <h2 className="text-xl font-semibold">

                    </h2>
                </div>
            </div>
        </div>
    )
}




export default Calendar;