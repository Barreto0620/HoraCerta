export interface User {
  id: string;
  name: string;
  email: string;
  department: string;
  ip_address?: string;
  avatar_url?: string;
  phone?: string;
  timezone?: string;
  is_active?: boolean;
  last_login_at?: string;
  created_at: string;
  updated_at: string;
}

export interface TimeEntry {
  id: string;
  user_id: string;
  date: string;
  start_time: string;
  minutes: number;
  ticket_id?: string;
  description?: string;
  project_name?: string;
  activity_type?: string;
  is_billable?: boolean;
  is_approved?: boolean;
  approved_by?: string;
  approved_at?: string;
  created_at: string;
  updated_at: string;
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