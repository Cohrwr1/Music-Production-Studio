import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Phone, 
  Mail, 
  Calendar, 
  Edit3, 
  Trash2, 
  CreditCard, 
  FileSpreadsheet,
  Filter,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Student } from '../types';

interface StudentDirectoryViewProps {
  students: Student[];
  classes: string[];
  onOpenAddModal: () => void;
  onOpenEditModal: (student: Student) => void;
  onDeleteStudent: (id: string) => void;
  onOpenRecordFeeModal: (student: Student) => void;
}

export const StudentDirectoryView: React.FC<StudentDirectoryViewProps> = ({
  students,
  classes,
  onOpenAddModal,
  onOpenEditModal,
  onDeleteStudent,
  onOpenRecordFeeModal
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('All');

  const filteredStudents = students.filter(s => {
    const matchesClass = selectedClass === 'All' || s.className === selectedClass;
    const matchesSearch = 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.parentPhone.includes(searchQuery) ||
      (s.email && s.email.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesClass && matchesSearch;
  });

  return (
    <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header bar */}
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
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Student Directory & Records</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Managing {students.length} students. Add new students instantly as your classes grow.
          </p>
        </div>

        <button onClick={onOpenAddModal} className="btn-primary">
          <Plus size={17} /> Add New Student
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        flexWrap: 'wrap'
      }}>
        {/* Class Filter Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
          <button
            onClick={() => setSelectedClass('All')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.85rem',
              fontWeight: 700,
              background: selectedClass === 'All' ? 'var(--primary)' : 'var(--bg-surface)',
              color: selectedClass === 'All' ? 'white' : 'var(--text-main)',
              border: '1px solid',
              borderColor: selectedClass === 'All' ? 'var(--primary)' : 'var(--border-color)'
            }}
          >
            All Students ({students.length})
          </button>
          {classes.map(cName => {
            const count = students.filter(s => s.className === cName).length;
            const isSelected = selectedClass === cName;
            return (
              <button
                key={cName}
                onClick={() => setSelectedClass(cName)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  background: isSelected ? 'var(--primary)' : 'var(--bg-surface)',
                  color: isSelected ? 'white' : 'var(--text-main)',
                  border: '1px solid',
                  borderColor: isSelected ? 'var(--primary)' : 'var(--border-color)',
                  whiteSpace: 'nowrap'
                }}
              >
                {cName} ({count})
              </button>
            );
          })}
        </div>

        {/* Search Field */}
        <div style={{ position: 'relative', width: '280px' }}>
          <input
            type="text"
            placeholder="Search name, roll no, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.55rem 0.85rem 0.55rem 2.2rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-surface)',
              fontSize: '0.875rem',
              outline: 'none'
            }}
          />
          <Search size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        </div>
      </div>

      {/* Grid of Student Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '1.25rem'
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
            No students found matching search.
          </div>
        ) : (
          filteredStudents.map(student => (
            <div key={student.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem' }}>
              
              {/* Header Info */}
              <div>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: 'var(--radius-full)',
                      background: student.avatarColor || 'var(--primary)',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '1rem'
                    }}>
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{student.name}</h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{student.className}</span>
                        <span>•</span>
                        <span>Roll #{student.rollNumber}</span>
                      </div>
                    </div>
                  </div>

                  <span className={`badge ${
                    student.feeStatus === 'paid' ? 'badge-paid' : student.feeStatus === 'pending' ? 'badge-pending' : 'badge-overdue'
                  }`}>
                    {student.feeStatus === 'paid' ? 'Fee Paid' : student.feeStatus === 'pending' ? 'Fee Pending' : 'Fee Overdue'}
                  </span>
                </div>

                {/* Personal Information Grid */}
                <div style={{
                  background: 'var(--bg-app)',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.825rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.4rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
                    <Users size={14} style={{ color: 'var(--text-muted)' }} />
                    <span><strong>Parent:</strong> {student.parentName}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
                    <Phone size={14} style={{ color: 'var(--text-muted)' }} />
                    <span><strong>Phone:</strong> {student.parentPhone}</span>
                  </div>
                  {student.email && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
                      <Mail size={14} style={{ color: 'var(--text-muted)' }} />
                      <span>{student.email}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.775rem', marginTop: '0.2rem' }}>
                    <span>Monthly Fee: ₹{student.monthlyFee}</span>
                    <span>Joined: {student.joiningDate}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)' }}>
                <button
                  onClick={() => onOpenRecordFeeModal(student)}
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <CreditCard size={14} /> Record Fee
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button
                    onClick={() => onOpenEditModal(student)}
                    title="Edit Student Info"
                    style={{
                      padding: '0.35rem 0.6rem',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-surface-subtle)',
                      color: 'var(--text-main)'
                    }}
                  >
                    <Edit3 size={14} />
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete ${student.name}?`)) {
                        onDeleteStudent(student.id);
                      }
                    }}
                    title="Delete Student"
                    style={{
                      padding: '0.35rem 0.6rem',
                      borderRadius: 'var(--radius-md)',
                      background: '#FEF2F2',
                      color: '#DC2626'
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
};
