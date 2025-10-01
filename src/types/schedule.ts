export interface ScheduleItem {
  id: string;
  title: string;
  room: string;
  startTime: string;
  endTime: string;
  day: string;
  notes?: string;
  color?: string;
}

export interface Assignment {
  id: string;
  title: string;
  description?: string;
  dueDate: Date;
  subject?: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  notifications: {
    twoDaysBefore: boolean;
    oneDayBefore: boolean;
    sameDay: boolean;
    eightHoursBefore: boolean;
  };
}

export type DayOfWeek = 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu' | 'Minggu';

export const DAYS_ORDER: DayOfWeek[] = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];