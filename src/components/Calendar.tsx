import React, { useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Event, Resource } from '../types';
import { generateDatesForMonth, getRandomColor } from '../utils';

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
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [dragOffset, setDragOffset] = useState(0);

  const dates = generateDatesForMonth(currentDate);

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
      id: Math.random().toString(36).substr(2, 9),
      title: 'New Event',
      startDate: date,
      endDate: new Date(date.getTime() + 24 * 60 * 60 * 1000),
      resourceId,
      color: getRandomColor(),
    };
    onEventAdd(newEvent);
  };

  const handleDragStart = (event: React.MouseEvent, calendarEvent: Event) => {
    event.stopPropagation();
    setIsDragging(true);
    setDragStartX(event.clientX);
    setSelectedEvent(calendarEvent);
    setDragOffset(0);
  };

  const handleDrag = useCallback((event: MouseEvent) => {
    if (isDragging && selectedEvent) {
      const currentX = event.clientX;
      const diff = currentX - dragStartX;
      const dayWidth = document.querySelector('.grid-cols-31 > div')?.clientWidth || 50;
      const dayOffset = Math.round(diff / dayWidth);
      
      if (dayOffset !== dragOffset) {
        setDragOffset(dayOffset);
        const newStartDate = new Date(selectedEvent.startDate);
        newStartDate.setDate(newStartDate.getDate() + dayOffset);
        const newEndDate = new Date(selectedEvent.endDate);
        newEndDate.setDate(newEndDate.getDate() + dayOffset);
        
        onEventUpdate({
          ...selectedEvent,
          startDate: newStartDate,
          endDate: newEndDate,
        });
      }
    }
  }, [isDragging, selectedEvent, dragStartX, dragOffset, onEventUpdate]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    setSelectedEvent(null);
    setDragOffset(0);
  }, []);

  React.useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDrag);
      window.addEventListener('mouseup', handleDragEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleDrag);
      window.removeEventListener('mouseup', handleDragEnd);
    };
  }, [isDragging, handleDrag, handleDragEnd]);

  const handleEventDelete = (event: React.MouseEvent, eventId: string) => {
    event.stopPropagation();
    if (window.confirm('Are you sure you want to delete this event?')) {
      onEventDelete(eventId);
    }
  };

  const handleAddResource = () => {
    const name = prompt('Enter resource name:');
    if (name) {
      onResourceAdd({
        id: Math.random().toString(36).substr(2, 9),
        name,
      });
    }
  };

  const formatDateHeader = (date: Date) => {
    const day = date.getDate();
    const weekday = date.toLocaleDateString('en-US', { weekday: 'short' });
    return (
      <div className="flex flex-col items-center">
        <span className="text-xs text-gray-600">{weekday}</span>
        <span className="font-medium">{day}</span>
      </div>
    );
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

              {resources.map((resource) => (
                <React.Fragment key={resource.id}>
                  {dates.map((date) => (
                    <div
                      key={`${resource.id}-${date.toISOString()}`}
                      className="h-20 border-b border-r relative"
                      onClick={(e) => handleCellClick(date, resource.id, e)}
                    >
                      {events
                        .filter(
                          (event) =>
                            event.resourceId === resource.id &&
                            event.startDate.toDateString() ===
                              date.toDateString()
                        )
                        .map((event) => (
                          <div
                            key={event.id}
                            className={`event-item absolute top-1 left-1 right-1 p-1 rounded text-sm cursor-move ${
                              isDragging && selectedEvent?.id === event.id ? 'opacity-50' : ''
                            }`}
                            style={{ backgroundColor: event.color }}
                            onMouseDown={(e) => handleDragStart(e, event)}
                            onDoubleClick={(e) => handleEventDelete(e, event.id)}
                          >
                            {event.title}
                          </div>
                        ))}
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;