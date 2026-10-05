import { Student, ClassGroup, AttendanceRecord, FeePayment, GoogleSheetsConfig } from '../types';

const STORAGE_KEYS = {
  STUDENTS: 'eduflow_students_v1',
  CLASSES: 'eduflow_classes_v1',
  ATTENDANCE: 'eduflow_attendance_v1',
  FEES: 'eduflow_fees_v1',
  SHEETS_CONFIG: 'eduflow_sheets_config_v1',
};

const DEFAULT_CLASSES: ClassGroup[] = [
  { id: 'c1', name: 'Class 10-A', code: '10A', description: 'Science & Mathematics Stream', scheduleTime: '08:00 AM - 01:30 PM', roomNo: 'Room 201' },
  { id: 'c2', name: 'Class 10-B', code: '10B', description: 'Commerce & Humanities Stream', scheduleTime: '08:30 AM - 02:00 PM', roomNo: 'Room 204' },
  { id: 'c3', name: 'Class 9-A', code: '9A', description: 'General Foundation Batch', scheduleTime: '09:00 AM - 02:30 PM', roomNo: 'Room 105' },
];

const AVATAR_COLORS = [
  '#4F46E5', '#0284C7', '#0D9488', '#16A34A', '#D97706',
  '#DC2626', '#9333EA', '#DB2777', '#2563EB', '#059669'
];

// Generate 45 realistic students for high capacity out of the box
const generateInitialStudents = (): Student[] => {
  const firstNames = [
    'Aarav', 'Ananya', 'Rohan', 'Priya', 'Vivaan', 'Diya', 'Aditya', 'Sanya', 'Kabir', 'Isha',
    'Arjun', 'Sneha', 'Vihaan', 'Tanvi', 'Dev', 'Kavya', 'Reyansh', 'Meera', 'Krishna', 'Riya',
    'Ishaan', 'Kriti', 'Shaurya', 'Aanya', 'Yash', 'Avani', 'Ayush', 'Zara', 'Dhruv', 'Pari',
    'Neer', 'Bhavya', 'Atharv', 'Nisha', 'Rudra', 'Prisha', 'Manan', 'Tanya', 'Samarth', 'Anika',
    'Siddharth', 'Navya', 'Harsh', 'Tara', 'Karan'
  ];

  const lastNames = [
    'Sharma', 'Verma', 'Gupta', 'Patel', 'Singh', 'Kumar', 'Mehta', 'Joshi', 'Shah', 'Nair',
    'Rao', 'Chopra', 'Malhotra', 'Bhatia', 'Kapoor', 'Deshmukh', 'Reddy', 'Agarwal', 'Sen', 'Dutta',
    'Roy', 'Bose', 'Puri', 'Sinha', 'Thakur', 'Saxena', 'Pandey', 'Mishra', 'Trivedi', 'Kulkarni'
  ];

  const classes = ['Class 10-A', 'Class 10-B', 'Class 9-A'];

  return Array.from({ length: 45 }, (_, idx) => {
    const fn = firstNames[idx % firstNames.length];
    const ln = lastNames[idx % lastNames.length];
    const className = classes[idx % classes.length];
    const rollNo = `${101 + idx}`;
    const feeStatus = idx % 5 === 0 ? 'pending' : idx % 9 === 0 ? 'overdue' : 'paid';

    return {
      id: `std_${idx + 1}`,
      rollNumber: rollNo,
      name: `${fn} ${ln}`,
      className,
      parentName: `Mr. ${fn.slice(0, 3)} ${ln}`,
      parentPhone: `+91 98${Math.floor(10000000 + Math.random() * 90000000)}`,
      studentPhone: `+91 97${Math.floor(10000000 + Math.random() * 90000000)}`,
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}@example.com`,
      address: `House No. ${idx + 12}, Sector ${Math.floor(idx % 15) + 1}, Main City`,
      joiningDate: '2026-04-01',
      monthlyFee: 2500,
      feeStatus,
      avatarColor: AVATAR_COLORS[idx % AVATAR_COLORS.length]
    };
  });
};

const generateInitialAttendance = (students: Student[]): AttendanceRecord[] => {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  const classes = ['Class 10-A', 'Class 10-B', 'Class 9-A'];
  const records: AttendanceRecord[] = [];

  [today, yesterday].forEach(date => {
    classes.forEach(cName => {
      const classStudents = students.filter(s => s.className === cName);
      const studentMap: Record<string, any> = {};
      classStudents.forEach((s, i) => {
        // Mark 85% present, 15% absent
        studentMap[s.id] = (i % 6 === 0) ? 'absent' : 'present';
      });

      records.push({
        id: `${date}_${cName.replace(/\s+/g, '_')}`,
        date,
        className: cName,
        records: studentMap,
        updatedAt: new Date().toISOString()
      });
    });
  });

  return records;
};

// Storage Service API
export const storageService = {
  getStudents(): Student[] {
    const data = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    if (!data) {
      const initial = generateInitialStudents();
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(initial));
      return initial;
    }
    try {
      return JSON.parse(data);
    } catch {
      return generateInitialStudents();
    }
  },

  saveStudents(students: Student[]): void {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  },

  getClasses(): ClassGroup[] {
    const data = localStorage.getItem(STORAGE_KEYS.CLASSES);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(DEFAULT_CLASSES));
      return DEFAULT_CLASSES;
    }
    try {
      return JSON.parse(data);
    } catch {
      return DEFAULT_CLASSES;
    }
  },

  saveClasses(classes: ClassGroup[]): void {
    localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(classes));
  },

  getAttendance(): AttendanceRecord[] {
    const data = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    if (!data) {
      const students = this.getStudents();
      const initial = generateInitialAttendance(students);
      localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(initial));
      return initial;
    }
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  saveAttendance(records: AttendanceRecord[]): void {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(records));
  },

  getFees(): FeePayment[] {
    const data = localStorage.getItem(STORAGE_KEYS.FEES);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  saveFees(fees: FeePayment[]): void {
    localStorage.setItem(STORAGE_KEYS.FEES, JSON.stringify(fees));
  },

  getSheetsConfig(): GoogleSheetsConfig {
    const data = localStorage.getItem(STORAGE_KEYS.SHEETS_CONFIG);
    if (!data) {
      return {
        autoSync: false,
        status: 'disconnected'
      };
    }
    try {
      return JSON.parse(data);
    } catch {
      return { autoSync: false, status: 'disconnected' };
    }
  },

  saveSheetsConfig(config: GoogleSheetsConfig): void {
    localStorage.setItem(STORAGE_KEYS.SHEETS_CONFIG, JSON.stringify(config));
  }
};
