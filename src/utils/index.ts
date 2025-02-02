export const generateDatesForMonth = (date: Date): Date[] => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  return Array.from({ length: daysInMonth }, (_, i) => {
    return new Date(year, month, i + 1);
  });
};

export const getRandomColor = (): string => {
  const colors = [
    '#FFB6C1', // Light pink
    '#98FB98', // Pale green
    '#87CEFA', // Light sky blue
    '#DDA0DD', // Plum
    '#F0E68C', // Khaki
    '#E6E6FA', // Lavender
    '#FFA07A', // Light salmon
    '#90EE90', // Light green
    '#ADD8E6', // Light blue
    '#F08080', // Light coral
  ];
  
  return colors[Math.floor(Math.random() * colors.length)];
};