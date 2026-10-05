import React, { useState } from 'react';
import { 
  CreditCard, 
  Search, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Download,
  Calendar
} from 'lucide-react';
import { Student, FeePayment } from '../types';
import { googleSheetsService } from '../services/googleSheets';

interface FeeTrackerViewProps {
  students: Student[];
  feePayments: FeePayment[];
  onOpenRecordFeeModal: (student?: Student) => void;
}

export const FeeTrackerView: React.FC<FeeTrackerViewProps> = ({
  students,
  feePayments,
  onOpenRecordFeeModal
}) => {
  const [filterStatus, setFilterStatus] = useState<'All' | 'paid' | 'pending' | 'overdue'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Stats calculation
  const totalCollected = feePayments.reduce((acc, p) => acc + p.amount, 0);
  const pendingStudents = students.filter(s => s.feeStatus === 'pending');
  const overdueStudents = students.filter(s => s.feeStatus === 'overdue');
  const totalPendingDues = students
    .filter(s => s.feeStatus !== 'paid')
    .reduce((acc, s) => acc + s.monthlyFee, 0);

  const filteredStudents = students.filter(s => {
    const matchesStatus = filterStatus === 'All' || s.feeStatus === filterStatus;
    const matchesSearch = 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.className.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleExportFeesCSV = () => {
    const headers = ['Receipt No', 'Date', 'Student ID', 'Student Name', 'Class', 'Amount', 'Month For', 'Payment Method'];
    const rows = feePayments.map(f => [
      f.receiptNo, f.date, f.studentId, f.studentName, f.className, f.amount, f.monthFor, f.paymentMethod
    ]);
    googleSheetsService.exportToCSV('Fee_Payment_Records', headers, rows);
  };

  return (
    <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Banner */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Fee Payment & Billing Tracker</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Monitor student monthly fees, record payments, and export fee receipts.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={handleExportFeesCSV} className="btn-secondary" style={{ fontSize: '0.825rem' }}>
            <Download size={15} /> Export Fees CSV
          </button>
          <button onClick={() => onOpenRecordFeeModal()} className="btn-primary">
            <Plus size={17} /> Record Payment
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.25rem'
      }}>
        <div className="card" style={{ background: '#ECFDF5', borderColor: '#A7F3D0' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#047857' }}>Total Collected</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#064E3B', marginTop: '0.2rem' }}>
            ₹{totalCollected.toLocaleString()}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#047857' }}>{feePayments.length} Payments Recorded</span>
        </div>

        <div className="card" style={{ background: '#FFFBEB', borderColor: '#FDE68A' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#B45309' }}>Pending Fees</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#78350F', marginTop: '0.2rem' }}>
            {pendingStudents.length} Students
          </div>
          <span style={{ fontSize: '0.75rem', color: '#B45309' }}>Pending monthly dues</span>
        </div>

        <div className="card" style={{ background: '#FEF2F2', borderColor: '#FECACA' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#B91C1C' }}>Overdue Fees</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#7F1D1D', marginTop: '0.2rem' }}>
            {overdueStudents.length} Students
          </div>
          <span style={{ fontSize: '0.75rem', color: '#B91C1C' }}>Requires urgent follow up</span>
        </div>

        <div className="card" style={{ background: '#EEF2FF', borderColor: '#C7D2FE' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#4338CA' }}>Total Outstanding Dues</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1E1B4B', marginTop: '0.2rem' }}>
            ₹{totalPendingDues.toLocaleString()}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#4338CA' }}>Across all batches</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        flexWrap: 'wrap'
      }}>
        {/* Status Filter Pills */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {(['All', 'paid', 'pending', 'overdue'] as const).map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status as any)}
              style={{
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.825rem',
                fontWeight: 700,
                background: filterStatus === status ? 'var(--primary)' : 'var(--bg-surface)',
                color: filterStatus === status ? 'white' : 'var(--text-main)',
                border: '1px solid',
                borderColor: filterStatus === status ? 'var(--primary)' : 'var(--border-color)',
                textTransform: 'capitalize'
              }}
            >
              {status === 'All' ? 'All Statuses' : status}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div style={{ position: 'relative', width: '260px' }}>
          <input
            type="text"
            placeholder="Search student or class..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.55rem 0.85rem 0.55rem 2.2rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-surface)',
              fontSize: '0.85rem',
              outline: 'none'
            }}
          />
          <Search size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        </div>
      </div>

      {/* Students Fee Status Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)', fontWeight: 700, fontSize: '0.95rem' }}>
          Student Fee Roster ({filteredStudents.length} Students)
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-surface-subtle)', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '0.75rem 1.5rem' }}>Student Name</th>
                <th style={{ padding: '0.75rem 1rem' }}>Roll No</th>
                <th style={{ padding: '0.75rem 1rem' }}>Class</th>
                <th style={{ padding: '0.75rem 1rem' }}>Monthly Fee</th>
                <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                <th style={{ padding: '0.75rem 1.5rem', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map(student => (
                <tr key={student.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.85rem 1.5rem', fontWeight: 600 }}>
                    {student.name}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)' }}>
                    #{student.rollNumber}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>
                    {student.className}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>
                    ₹{student.monthlyFee}
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span className={`badge ${
                      student.feeStatus === 'paid' ? 'badge-paid' : student.feeStatus === 'pending' ? 'badge-pending' : 'badge-overdue'
                    }`}>
                      {student.feeStatus === 'paid' ? 'Paid' : student.feeStatus === 'pending' ? 'Pending' : 'Overdue'}
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem 1.5rem', textAlign: 'right' }}>
                    <button
                      onClick={() => onOpenRecordFeeModal(student)}
                      style={{
                        padding: '0.4rem 0.75rem',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        background: 'var(--primary-light)',
                        color: 'var(--primary)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem'
                      }}
                    >
                      <CreditCard size={14} /> Record Payment
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
