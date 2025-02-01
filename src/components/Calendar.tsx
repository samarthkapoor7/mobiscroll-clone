import React, { useState } from "react";
import { Event, Resource } from "../types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getRandomColor } from "../utils";


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

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
    };

    const handleCellClick = (date: Date, resourceId: string, event: React.MouseEvent) => {
        if ((event.target as HTMLElement).closest('.event-item')) {
            return;
        }

        const newEvent: Event = {
            id: Math.random().toString(36).substring(2, 9),
            title: 'New Event',
            startDate: date,
            endDate: new Date(date.getTime() + 24 * 60 * 60 * 1000),
            resourceId,
            color: getRandomColor(),
        };
        onEventAdd(newEvent);
    };

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
                        {currentDate.toLocaleString('default', {
                            month: 'long',
                            year: 'numeric',
                        })}
                    </h2>
                    <button
                      onClick={handleNextMonth}
                      className="p-2 hover:bg-gray-100 rounded"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
                <button
                  onClick={handleAddResource}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Add Resource
                </button>
            </div>

            <div className="flex-1 overflow-auto">
                <div className="grid grid-cols-[200px_1fr] h-full">
                    <div className="border-r">
                        <div className="h-12 border-b bg-gray-50"></div>
                        {resources.map((resource) => (
                            <div
                              key={resource.id}
                              className="h-20 border-b px-4 py-2 flex items-center"
                            >
                                {resource.name}
                            </div>
                        ))}
                    </div>

                    <div className="overflow-auto">
                        <div className="grid grid-cols-31 min-w-[1550px]">
                            {dates.map((date) => (
                                <div
                                  key={date.toISOString()}
                                  className={`h-12 border-b border-r flex items-center justify-center ${
                                    date.toDateString() === new Date().toDateString()
                                      ? 'bg-blue-50'
                                      : 'bg-gray-50'
                                  }`}
                                >
                                    {formatDateHeader(date)}
                                </div>
                            ))}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}




export default Calendar;