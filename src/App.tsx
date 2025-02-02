import React, { useState } from 'react';
import Calendar from './components/Calendar';
import { Event, Resource } from './types';

function App() {
  const [events, setEvents] = useState<Event[]>([]);
  const [resources, setResources] = useState<Resource[]>([
    { id: '1', name: 'Resource A' },
    { id: '2', name: 'Resource B' },
    { id: '3', name: 'Resource C' },
  ]);

  const handleEventAdd = (event: Event) => {
    setEvents([...events, event]);
  };

  const handleEventUpdate = (updatedEvent: Event) => {
    setEvents(events.map(event => 
      event.id === updatedEvent.id ? updatedEvent : event
    ));
  };

  const handleEventDelete = (eventId: string) => {
    setEvents(events.filter(event => event.id !== eventId));
  };

  const handleResourceAdd = (resource: Resource) => {
    setResources([...resources, resource]);
  };

  return (
    <div className="h-screen">
      <Calendar
        events={events}
        resources={resources}
        onEventAdd={handleEventAdd}
        onEventUpdate={handleEventUpdate}
        onEventDelete={handleEventDelete}
        onResourceAdd={handleResourceAdd}
      />
    </div>
  );
}

export default App;