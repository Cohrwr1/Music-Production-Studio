import React from 'react';
import { 
  Users, 
  UserCheck, 
  UserX, 
  CreditCard, 
  ArrowRight,
  TrendingUp,
  Clock,
  Sparkles
} from 'lucide-react';
import { Student, AttendanceRecord, FeePayment, ActiveTab } from '../types';

interface DashboardProps {
  students: Student[];
  attendanceRecords: AttendanceRecord[];
  feePayments: FeePayment[];
  onNavigate: (tab: ActiveTab) => void;
  selectedClassFilter: string;
}

export const Dashboard: React.FC<DashboardProps> = ({
  students,
  attendanceRecords,
  feePayments,
  onNavigate
}) => {
  const todayStr = new Date().toISOString().split('T')[0];

  // Calculate stats for today
  let presentToday = 0;
  let absentToday = 0;

  attendanceRecords
    .filter(r => r.date === todayStr)
    .forEach(r => {
      Object.values(r.records).forEach(status => {
        if (status === 'present') presentToday++;
        if (status === 'absent') absentToday++;
      });
    });

  const totalMarkedToday = presentToday + absentToday;
  const attendancePercentage = totalMarkedToday > 0 
    ? Math.round((presentToday / totalMarkedToday) * 100) 
    : 0;

  // Fee Stats
  const pendingStudents = students.filter(s => s.feeStatus === 'pending' || s.feeStatus === 'overdue');
  const totalPendingAmount = pendingStudents.reduce((acc, s) => acc + s.monthlyFee, 0);

  // Group students by class
  const classCounts: Record<string, number> = {};
  students.forEach(s => {
    classCounts[s.className] = (classCounts[s.className] || 0) + 1;
  });

  return (
    <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)',
        border: '1px solid #C7D2FE',
        borderRadius: 'var(--radius-lg)',
        padding: '1.5rem 1.75rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.35rem' }}>
            <Sparkles size={16} /> Quick Overview & Attendance Hub
          </div>
          <h2 style={{ fontSize: '1.4rem', color: '#1E1B4B', fontWeight: 800 }}>
            Daily Class & Student Dashboard
          </h2>
          <p style={{ color: '#4338CA', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            {students.length} students enrolled across {Object.keys(classCounts).length} classes. Mark attendance or link Google Sheets in seconds.
          </p>
        </div>

        <button 
          onClick={() => onNavigate('attendance')}
          className="btn-primary" 
          style={{ padding: '0.75rem 1.35rem' }}
        >
          <span>Take Today's Attendance</span>
          <ArrowRight size={17} />
        </button>
      </div>

      {/* Stats Cards Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
        gap: '1.25rem'
      }}>
        {/* Stat 1: Total Students */}
        <div className="card" style={{ background: '#FAF5FF', borderColor: '#E9D5FF' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#7E22CE' }}>Total Students</span>
            <div style={{ padding: '0.5rem', background: '#F3E8FF', borderRadius: 'var(--radius-md)', color: '#9333EA' }}>
              <Users size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#581C87' }}>{students.length}</div>
          <div style={{ fontSize: '0.775rem', color: '#7E22CE', marginTop: '0.25rem' }}>
            Capacity for 50+ students
          </div>
        </div>

        {/* Stat 2: Present Today */}
        <div className="card" style={{ background: '#ECFDF5', borderColor: '#A7F3D0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#047857' }}>Present Today</span>
            <div style={{ padding: '0.5rem', background: '#D1FAE5', borderRadius: 'var(--radius-md)', color: '#10B981' }}>
              <UserCheck size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#064E3B' }}>{presentToday}</div>
          <div style={{ fontSize: '0.775rem', color: '#047857', marginTop: '0.25rem' }}>
            {attendancePercentage}% attendance rate
          </div>
        </div>

        {/* Stat 3: Absent Today */}
        <div className="card" style={{ background: '#FEF2F2', borderColor: '#FECACA' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#B91C1C' }}>Absent Today</span>
            <div style={{ padding: '0.5rem', background: '#FEE2E2', borderRadius: 'var(--radius-md)', color: '#EF4444' }}>
              <UserX size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#7F1D1D' }}>{absentToday}</div>
          <div style={{ fontSize: '0.775rem', color: '#B91C1C', marginTop: '0.25rem' }}>
            Needs parent follow-up
          </div>
        </div>

        {/* Stat 4: Fee Dues */}
        <div className="card" style={{ background: '#FFFBEB', borderColor: '#FDE68A' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#B45309' }}>Pending Fee Dues</span>
            <div style={{ padding: '0.5rem', background: '#FEF3C7', borderRadius: 'var(--radius-md)', color: '#F59E0B' }}>
              <CreditCard size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#78350F' }}>
            ₹{totalPendingAmount.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.775rem', color: '#B45309', marginTop: '0.25rem' }}>
            {pendingStudents.length} students pending payment
          </div>
        </div>
      </div>

      {/* Class Wise Quick Action Grid */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Class & Batch Attendance Summary</h3>
          <button 
            onClick={() => onNavigate('classes')}
            style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}
          >
            Manage Classes <ArrowRight size={14} />
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.25rem'
        }}>
          {Object.entries(classCounts).map(([className, count]) => {
            // Calculate present in this class today
            const classRec = attendanceRecords.find(r => r.date === todayStr && r.className === className);
            let classPresent = 0;
            let classAbsent = 0;
            if (classRec) {
              Object.values(classRec.records).forEach(st => {
                if (st === 'present') classPresent++;
                if (st === 'absent') classAbsent++;
              });
            }

            return (
              <div key={className} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{className}</h4>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{count} Students Enrolled</span>
                  </div>
                  <span className="badge badge-present" style={{ fontSize: '0.75rem' }}>
                    Active Batch
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.85rem' }}>
                  <div style={{ flex: 1, padding: '0.5rem', background: 'var(--present-bg)', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                    <span style={{ color: 'var(--present-text)', fontWeight: 700 }}>{classPresent}</span> Present
                  </div>
                  <div style={{ flex: 1, padding: '0.5rem', background: 'var(--absent-bg)', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                    <span style={{ color: 'var(--absent-text)', fontWeight: 700 }}>{classAbsent}</span> Absent
                  </div>
                </div>

                <button
                  onClick={() => onNavigate('attendance')}
                  className="btn-secondary"
                  style={{ width: '100%', justifyContent: 'center', fontSize: '0.85rem' }}
                >
                  Mark Attendance for {className}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
