export interface Event {
    id: string;
    title: string;
    startDate: Date;
    endDate: Date;
    resourceId: string;
    color: string;
  }
  
  export interface Resource {
    id: string;
    name: string;
  }
  
  export interface DragState {
    isDragging: boolean;
    eventId: string | null;
    startX: number;
    startY: number;
  }