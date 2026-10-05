export type AttendanceStatus = 'present' | 'absent' | 'excused' | 'unmarked';

export interface Student {
  id: string;
  name: string;
  dob: string; // YYYY-MM-DD
  age: number;
  email: string;
  phone: string;
  joiningDate: string; // YYYY-MM-DD
  feeStatus: 'paid' | 'pending' | 'overdue';
  musicClass: string; // e.g. "Piano Class", "Guitar Batch", "Vocal Training"
  avatarColor?: string;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  className: string;
  records: Record<string, AttendanceStatus>;
  updatedAt: string;
}

export interface ClassGroup {
  id: string;
  name: string;
  code: string;
  description?: string;
  scheduleTime?: string;
  roomNo?: string;
}

export interface GoogleSheetsConfig {
  sheetUrl?: string;
  scriptUrl?: string;
  sheetId?: string;
  autoSync: boolean;
  lastSyncedAt?: string;
  status: 'connected' | 'disconnected' | 'syncing' | 'error';
}

export type ActiveTab = 'dashboard' | 'attendance' | 'students' | 'fees' | 'classes' | 'sheets';
