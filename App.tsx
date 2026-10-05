import React, { useState, useEffect } from 'react';
import { 
  Student, 
  ClassGroup, 
  AttendanceRecord, 
  FeePayment, 
  GoogleSheetsConfig, 
  ActiveTab, 
  AttendanceStatus 
} from './types';
import { storageService } from './services/storage';
import { googleSheetsService } from './services/googleSheets';

import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { AttendanceView } from './components/AttendanceView';
import { StudentDirectoryView } from './components/StudentDirectoryView';
import { FeeTrackerView } from './components/FeeTrackerView';
import { ClassesView } from './components/ClassesView';
import { StudentModal } from './components/StudentModal';
import { FeeModal } from './components/FeeModal';
import { GoogleSheetsModal } from './components/GoogleSheetsModal';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('attendance');
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<ClassGroup[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [feePayments, setFeePayments] = useState<FeePayment[]>([]);
  const [sheetsConfig, setSheetsConfig] = useState<GoogleSheetsConfig>({ autoSync: false, status: 'disconnected' });
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Modals state
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState<Student | null>(null);
  
  const [isFeeModalOpen, setIsFeeModalOpen] = useState(false);
  const [selectedStudentForFee, setSelectedStudentForFee] = useState<Student | null>(null);

  const [isSheetsModalOpen, setIsSheetsModalOpen] = useState(false);

  // Initialize data from LocalStorage
  useEffect(() => {
    const loadedStudents = storageService.getStudents();
    const loadedClasses = storageService.getClasses();
    const loadedAttendance = storageService.getAttendance();
    const loadedFees = storageService.getFees();
    const loadedConfig = storageService.getSheetsConfig();

    setStudents(loadedStudents);
    setClasses(loadedClasses);
    setAttendanceRecords(loadedAttendance);
    setFeePayments(loadedFees);
    setSheetsConfig(loadedConfig);
  }, []);

  const updateStudents = (newStudents: Student[]) => {
    setStudents(newStudents);
    storageService.saveStudents(newStudents);
  };

  const updateClasses = (newClasses: ClassGroup[]) => {
    setClasses(newClasses);
    storageService.saveClasses(newClasses);
  };

  const updateAttendance = (newRecords: AttendanceRecord[]) => {
    setAttendanceRecords(newRecords);
    storageService.saveAttendance(newRecords);
  };

  const updateFees = (newFees: FeePayment[]) => {
    setFeePayments(newFees);
    storageService.saveFees(newFees);
  };

  // Student Actions
  const handleSaveStudent = (studentData: Partial<Student>) => {
    if (studentToEdit) {
      const updated = students.map(s => s.id === studentToEdit.id ? { ...s, ...studentData } as Student : s);
      updateStudents(updated);
    } else {
      const newStudent: Student = {
        id: `std_${Date.now()}`,
        rollNumber: studentData.rollNumber || `${100 + students.length + 1}`,
        name: studentData.name || 'New Student',
        className: studentData.className || classes[0]?.name || 'Class 10-A',
        parentName: studentData.parentName || 'Parent Name',
        parentPhone: studentData.parentPhone || '+91 9800000000',
        email: studentData.email,
        address: studentData.address,
        joiningDate: studentData.joiningDate || new Date().toISOString().split('T')[0],
        monthlyFee: studentData.monthlyFee || 2500,
        feeStatus: studentData.feeStatus || 'paid',
        avatarColor: '#4F46E5'
      };
      updateStudents([newStudent, ...students]);
    }
  };

  const handleDeleteStudent = (id: string) => {
    const filtered = students.filter(s => s.id !== id);
    updateStudents(filtered);
  };

  // Attendance Actions
  const handleSingleAttendanceUpdate = (
    date: string, 
    className: string, 
    studentId: string, 
    status: AttendanceStatus
  ) => {
    const recordId = `${date}_${className.replace(/\s+/g, '_')}`;
    const existingIndex = attendanceRecords.findIndex(r => r.id === recordId);

    let updatedRecords: AttendanceRecord[];
    if (existingIndex >= 0) {
      updatedRecords = [...attendanceRecords];
      const record = { ...updatedRecords[existingIndex] };
      record.records = { ...record.records, [studentId]: status };
      record.updatedAt = new Date().toISOString();
      updatedRecords[existingIndex] = record;
    } else {
      const newRecord: AttendanceRecord = {
        id: recordId,
        date,
        className,
        records: { [studentId]: status },
        updatedAt: new Date().toISOString()
      };
      updatedRecords = [...attendanceRecords, newRecord];
    }

    updateAttendance(updatedRecords);
  };

  const handleBulkAttendanceUpdate = (
    date: string, 
    className: string, 
    studentIds: string[], 
    status: AttendanceStatus
  ) => {
    const recordId = `${date}_${className.replace(/\s+/g, '_')}`;
    const existingIndex = attendanceRecords.findIndex(r => r.id === recordId);

    let updatedRecords: AttendanceRecord[];
    if (existingIndex >= 0) {
      updatedRecords = [...attendanceRecords];
      const record = { ...updatedRecords[existingIndex] };
      const updatedMap = { ...record.records };
      studentIds.forEach(id => {
        updatedMap[id] = status;
      });
      record.records = updatedMap;
      record.updatedAt = new Date().toISOString();
      updatedRecords[existingIndex] = record;
    } else {
      const map: Record<string, AttendanceStatus> = {};
      studentIds.forEach(id => {
        map[id] = status;
      });
      const newRecord: AttendanceRecord = {
        id: recordId,
        date,
        className,
        records: map,
        updatedAt: new Date().toISOString()
      };
      updatedRecords = [...attendanceRecords, newRecord];
    }

    updateAttendance(updatedRecords);
  };

  // Fee Payment Action
  const handleRecordFeePayment = (paymentData: Partial<FeePayment>) => {
    const newPayment: FeePayment = {
      id: `fee_${Date.now()}`,
      studentId: paymentData.studentId || '',
      studentName: paymentData.studentName || '',
      className: paymentData.className || '',
      amount: paymentData.amount || 2500,
      date: paymentData.date || new Date().toISOString().split('T')[0],
      monthFor: paymentData.monthFor || 'October 2026',
      paymentMethod: paymentData.paymentMethod || 'UPI',
      receiptNo: paymentData.receiptNo || `REC-${Math.floor(100000 + Math.random() * 900000)}`,
      notes: paymentData.notes
    };

    updateFees([newPayment, ...feePayments]);

    const updatedStudents = students.map(s => {
      if (s.id === newPayment.studentId) {
        return { ...s, feeStatus: 'paid' as const };
      }
      return s;
    });
    updateStudents(updatedStudents);
  };

  const handleManualSync = async () => {
    if (!sheetsConfig.scriptUrl) {
      setIsSheetsModalOpen(true);
      return;
    }

    setIsSyncing(true);
    const result = await googleSheetsService.syncToGoogleSheet(
      sheetsConfig,
      students,
      attendanceRecords,
      feePayments
    );
    setIsSyncing(false);

    if (result.success) {
      const updatedConfig: GoogleSheetsConfig = {
        ...sheetsConfig,
        status: 'connected',
        lastSyncedAt: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString()
      };
      setSheetsConfig(updatedConfig);
      storageService.saveSheetsConfig(updatedConfig);
      alert('✅ Google Sheet updated successfully!');
    } else {
      alert(`⚠️ Sync failed: ${result.message}`);
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];
  let presentToday = 0;
  let absentToday = 0;
  attendanceRecords.filter(r => r.date === todayStr).forEach(r => {
    Object.values(r.records).forEach(st => {
      if (st === 'present') presentToday++;
      if (st === 'absent') absentToday++;
    });
  });

  const classNamesList = classes.map(c => c.name);

  return (
    <div className="app-layout">
      {/* Sidebar Navigation */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        attendanceCountToday={{ present: presentToday, absent: absentToday, total: students.length }}
      />

      {/* Main Content Area */}
      <div className="main-content">
        {/* Top Header */}
        <Header
          sheetsConfig={sheetsConfig}
          onOpenSheetsModal={() => setIsSheetsModalOpen(true)}
          onOpenAddStudentModal={() => {
            setStudentToEdit(null);
            setIsStudentModalOpen(true);
          }}
          onManualSync={handleManualSync}
          isSyncing={isSyncing}
          totalStudents={students.length}
        />

        {/* Tab Content Container */}
        <main className="content-container">
          {activeTab === 'dashboard' && (
            <Dashboard
              students={students}
              attendanceRecords={attendanceRecords}
              feePayments={feePayments}
              onNavigate={setActiveTab}
              selectedClassFilter="All"
            />
          )}

          {activeTab === 'attendance' && (
            <AttendanceView
              students={students}
              classes={classNamesList}
              attendanceRecords={attendanceRecords}
              onUpdateAttendance={handleSingleAttendanceUpdate}
              onBulkUpdateAttendance={handleBulkAttendanceUpdate}
              onOpenSheetsModal={() => setIsSheetsModalOpen(true)}
              onEditStudent={(st) => {
                setStudentToEdit(st);
                setIsStudentModalOpen(true);
              }}
            />
          )}

          {activeTab === 'students' && (
            <StudentDirectoryView
              students={students}
              classes={classNamesList}
              onOpenAddModal={() => {
                setStudentToEdit(null);
                setIsStudentModalOpen(true);
              }}
              onOpenEditModal={(st) => {
                setStudentToEdit(st);
                setIsStudentModalOpen(true);
              }}
              onDeleteStudent={handleDeleteStudent}
              onOpenRecordFeeModal={(st) => {
                setSelectedStudentForFee(st);
                setIsFeeModalOpen(true);
              }}
            />
          )}

          {activeTab === 'fees' && (
            <FeeTrackerView
              students={students}
              feePayments={feePayments}
              onOpenRecordFeeModal={(st) => {
                setSelectedStudentForFee(st || null);
                setIsFeeModalOpen(true);
              }}
            />
          )}

          {activeTab === 'classes' && (
            <ClassesView
              classes={classes}
              students={students}
              onAddClass={(newCls) => updateClasses([...classes, newCls])}
              onSelectClassFilter={(clsName) => {
                setActiveTab('students');
              }}
            />
          )}

          {activeTab === 'sheets' && (
            <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                Google Sheet Database Configuration
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Link your personal Google Sheet to EduFlow so all student data, daily attendance logs, and fee payments automatically save to your Google Sheet in real-time.
              </p>
              <button onClick={() => setIsSheetsModalOpen(true)} className="btn-primary">
                Open Google Sheets Setup Wizard
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Global Modals */}
      <StudentModal
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
        onSave={handleSaveStudent}
        studentToEdit={studentToEdit}
        classes={classNamesList}
      />

      <FeeModal
        isOpen={isFeeModalOpen}
        onClose={() => setIsFeeModalOpen(false)}
        onRecordPayment={handleRecordFeePayment}
        selectedStudent={selectedStudentForFee}
        students={students}
      />

      <GoogleSheetsModal
        isOpen={isSheetsModalOpen}
        onClose={() => setIsSheetsModalOpen(false)}
        config={sheetsConfig}
        onSaveConfig={(cfg) => {
          setSheetsConfig(cfg);
          storageService.saveSheetsConfig(cfg);
        }}
        students={students}
        attendanceRecords={attendanceRecords}
        feePayments={feePayments}
        onImportStudents={(imported) => {
          const formatted: Student[] = imported.map((imp, idx) => ({
            id: `std_imp_${Date.now()}_${idx}`,
            rollNumber: imp.rollNumber || `${100 + idx}`,
            name: imp.name || 'Imported Student',
            className: imp.className || 'Class 10-A',
            parentName: imp.parentName || 'Parent',
            parentPhone: imp.parentPhone || '',
            email: imp.email,
            address: imp.address,
            joiningDate: imp.joiningDate || new Date().toISOString().split('T')[0],
            monthlyFee: imp.monthlyFee || 2500,
            feeStatus: imp.feeStatus || 'paid',
            avatarColor: '#4F46E5'
          }));
          updateStudents([...formatted, ...students]);
        }}
        onManualSync={handleManualSync}
        isSyncing={isSyncing}
      />
    </div>
  );
};

export default App;
