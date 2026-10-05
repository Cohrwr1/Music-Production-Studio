import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Search, 
  Filter, 
  Calendar, 
  CheckCheck, 
  X, 
  RotateCcw,
  Sparkles,
  FileSpreadsheet,
  Edit3
} from 'lucide-react';
import { Student, AttendanceStatus, AttendanceRecord } from '../types';

interface AttendanceViewProps {
  students: Student[];
  classes: string[];
  attendanceRecords: AttendanceRecord[];
  onUpdateAttendance: (date: string, className: string, studentId: string, status: AttendanceStatus) => void;
  onBulkUpdateAttendance: (date: string, className: string, studentIds: string[], status: AttendanceStatus) => void;
  onOpenSheetsModal: () => void;
  onEditStudent?: (student: Student) => void;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({
  students,
  classes,
  attendanceRecords,
  onUpdateAttendance,
  onBulkUpdateAttendance,
  onOpenSheetsModal,
  onEditStudent
}) => {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filter students based on Class and Search Query
  const filteredStudents = students.filter(student => {
    const matchesClass = selectedClass === 'All' || student.className === selectedClass;
    const matchesSearch = 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.parentName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesClass && matchesSearch;
  });

  // Get current attendance status map for the selected date & class
  const getStudentStatus = (studentId: string, className: string): AttendanceStatus => {
    const record = attendanceRecords.find(r => r.date === selectedDate && r.className === className);
    return record?.records[studentId] || 'unmarked';
  };

  // Calculate live statistics for filtered list
  let presentCount = 0;
  let absentCount = 0;
  let unmarkedCount = 0;

  filteredStudents.forEach(student => {
    const st = getStudentStatus(student.id, student.className);
    if (st === 'present') presentCount++;
    else if (st === 'absent') absentCount++;
    else unmarkedCount++;
  });

  // Bulk Actions
  const handleBulkMark = (status: AttendanceStatus) => {
    if (selectedClass === 'All') {
      const classGrouped: Record<string, string[]> = {};
      filteredStudents.forEach(s => {
        if (!classGrouped[s.className]) classGrouped[s.className] = [];
        classGrouped[s.className].push(s.id);
      });
      Object.entries(classGrouped).forEach(([cName, ids]) => {
        onBulkUpdateAttendance(selectedDate, cName, ids, status);
      });
    } else {
      const ids = filteredStudents.map(s => s.id);
      onBulkUpdateAttendance(selectedDate, selectedClass, ids, status);
    }
  };

  return (
    <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Header Controls */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Attendance Record Manager</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Mark daily attendance with instant Present/Absent buttons. Click ✏️ Edit on any student card to edit student details.
            </p>
          </div>

          <button
            onClick={onOpenSheetsModal}
            className="btn-secondary"
            style={{ padding: '0.5rem 1rem', fontSize: '0.825rem' }}
          >
            <FileSpreadsheet size={15} />
            <span>Sync to Google Sheet</span>
          </button>
        </div>

        {/* Filter Bar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          paddingTop: '0.5rem',
          borderTop: '1px solid var(--border-color)'
        }}>
          {/* Date Picker */}
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
              Select Date
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.85rem 0.6rem 2.2rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-app)',
                  fontWeight: 600,
                  outline: 'none'
                }}
              />
              <Calendar size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          {/* Class Selector Filter */}
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
              Filter by Class / Batch
            </label>
            <div style={{ position: 'relative' }}>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.85rem 0.6rem 2.2rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-app)',
                  fontWeight: 600,
                  outline: 'none',
                  appearance: 'none'
                }}
              >
                <option value="All">All Classes ({students.length} Students)</option>
                {classes.map(c => (
                  <option key={c} value={c}>
                    {c} ({students.filter(s => s.className === c).length} Students)
                  </option>
                ))}
              </select>
              <Filter size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          {/* Search Box */}
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
              Search Student Name or Roll Number
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Type name, roll no, or parent..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.85rem 0.6rem 2.2rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-app)',
                  outline: 'none'
                }}
              />
              <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                >
                  <X size={15} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Stats Summary & Bulk Actions */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        background: 'var(--bg-surface)',
        padding: '1rem 1.25rem',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-color)'
      }}>
        {/* Status Counters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>
            Showing {filteredStudents.length} Students:
          </div>

          <div className="badge badge-present" style={{ fontSize: '0.85rem', padding: '0.35rem 0.85rem' }}>
            <CheckCircle2 size={15} /> {presentCount} Present
          </div>

          <div className="badge badge-absent" style={{ fontSize: '0.85rem', padding: '0.35rem 0.85rem' }}>
            <XCircle size={15} /> {absentCount} Absent
          </div>

          {unmarkedCount > 0 && (
            <div className="badge badge-pending" style={{ fontSize: '0.85rem', padding: '0.35rem 0.85rem' }}>
              ⏳ {unmarkedCount} Unmarked
            </div>
          )}
        </div>

        {/* Bulk Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.775rem', fontWeight: 700, color: 'var(--text-muted)' }}>Bulk Action:</span>
          
          <button
            onClick={() => handleBulkMark('present')}
            style={{
              padding: '0.45rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.8rem',
              fontWeight: 700,
              background: 'var(--present-bg)',
              color: 'var(--present-text)',
              border: '1px solid var(--present-border)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <CheckCheck size={14} /> Mark All Present
          </button>

          <button
            onClick={() => handleBulkMark('absent')}
            style={{
              padding: '0.45rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.8rem',
              fontWeight: 700,
              background: 'var(--absent-bg)',
              color: 'var(--absent-text)',
              border: '1px solid var(--absent-border)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <X size={14} /> Mark All Absent
          </button>
        </div>
      </div>

      {/* Student List with Present / Absent and Edit Buttons */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
        gap: '1rem'
      }}>
        {filteredStudents.length === 0 ? (
          <div style={{
            gridColumn: '1 / -1',
            padding: '3rem',
            textAlign: 'center',
            background: 'var(--bg-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-muted)'
          }}>
            No students found matching your filters.
          </div>
        ) : (
          filteredStudents.map(student => {
            const currentStatus = getStudentStatus(student.id, student.className);
            const isPresent = currentStatus === 'present';
            const isAbsent = currentStatus === 'absent';

            return (
              <div 
                key={student.id} 
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  borderLeft: isPresent 
                    ? '4px solid var(--present-accent)' 
                    : isAbsent 
                    ? '4px solid var(--absent-accent)' 
                    : '1px solid var(--border-color)',
                  background: isPresent 
                    ? '#FAFDFB' 
                    : isAbsent 
                    ? '#FFFDFD' 
                    : 'var(--bg-surface)',
                  transition: 'all 0.15s ease'
                }}
              >
                {/* Student Info Header */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: 'var(--radius-full)',
                        background: student.avatarColor || 'var(--primary)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '0.95rem',
                        flexShrink: 0
                      }}>
                        {student.name.charAt(0)}
                      </div>

                      <div>
                        <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>{student.name}</h4>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{student.className}</span> • Roll #{student.rollNumber}
                        </div>
                      </div>
                    </div>

                    {/* EDIT STUDENT BUTTON */}
                    {onEditStudent && (
                      <button
                        onClick={() => onEditStudent(student)}
                        style={{
                          background: 'var(--primary-light)',
                          color: 'var(--primary)',
                          border: '1px solid #C7D2FE',
                          padding: '0.35rem 0.65rem',
                          borderRadius: 'var(--radius-md)',
                          fontWeight: 700,
                          fontSize: '0.775rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem'
                        }}
                        title="Edit Student Information"
                      >
                        <Edit3 size={13} /> Edit
                      </button>
                    )}
                  </div>

                  <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', background: 'var(--bg-app)', padding: '0.4rem 0.6rem', borderRadius: 'var(--radius-sm)', marginBottom: '0.5rem' }}>
                    Parent: {student.parentPhone} • Payment: <strong style={{ color: 'var(--text-main)', textTransform: 'uppercase' }}>{student.feeStatus}</strong>
                  </div>
                </div>

                {/* DEDICATED PRESENT / ABSENT BUTTONS */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.65rem'
                }}>
                  {/* PRESENT BUTTON */}
                  <button
                    onClick={() => onUpdateAttendance(selectedDate, student.className, student.id, 'present')}
                    style={{
                      padding: '0.65rem 0.5rem',
                      borderRadius: 'var(--radius-md)',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem',
                      transition: 'all 0.15s ease',
                      border: isPresent ? '2px solid #10B981' : '1px solid var(--present-border)',
                      background: isPresent ? '#10B981' : 'var(--present-bg)',
                      color: isPresent ? 'white' : 'var(--present-text)',
                      boxShadow: isPresent ? '0 3px 10px rgba(16, 185, 129, 0.35)' : 'none'
                    }}
                  >
                    <CheckCircle2 size={18} />
                    <span>PRESENT</span>
                  </button>

                  {/* ABSENT BUTTON */}
                  <button
                    onClick={() => onUpdateAttendance(selectedDate, student.className, student.id, 'absent')}
                    style={{
                      padding: '0.65rem 0.5rem',
                      borderRadius: 'var(--radius-md)',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem',
                      transition: 'all 0.15s ease',
                      border: isAbsent ? '2px solid #EF4444' : '1px solid var(--absent-border)',
                      background: isAbsent ? '#EF4444' : 'var(--absent-bg)',
                      color: isAbsent ? 'white' : 'var(--absent-text)',
                      boxShadow: isAbsent ? '0 3px 10px rgba(239, 68, 68, 0.35)' : 'none'
                    }}
                  >
                    <XCircle size={18} />
                    <span>ABSENT</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
