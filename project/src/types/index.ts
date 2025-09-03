export interface User {
  id: string;
  name: string;
  email: string;
  department: string;
  ip?: string;
  createdAt: string;
}

export interface TimeEntry {
  id: string;
  userId: string;
  date: string;
  startTime: string;
  minutes: number;
  ticketId?: string;
  description?: string;
  createdAt: string;
}

export interface DayTotal {
  date: string;
  totalMinutes: number;
  entries: TimeEntry[];
}

export interface Theme {
  isDark: boolean;
}

export interface CalendarDay {
  date: Date;
  totalMinutes: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
}