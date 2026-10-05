import React, { useState } from 'react';
import { BookOpen, Plus, Users, Clock, MapPin, X } from 'lucide-react';
import { ClassGroup, Student } from '../types';

interface ClassesViewProps {
  classes: ClassGroup[];
  students: Student[];
  onAddClass: (newClass: ClassGroup) => void;
  onSelectClassFilter: (className: string) => void;
}

export const ClassesView: React.FC<ClassesViewProps> = ({
  classes,
  students,
  onAddClass,
  onSelectClassFilter
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [roomNo, setRoomNo] = useState('');
  const [description, setDescription] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddClass({
      id: `c_${Date.now()}`,
      name: name.trim(),
      code: code.trim() || name.slice(0, 4).toUpperCase(),
      scheduleTime: scheduleTime.trim() || '09:00 AM - 02:00 PM',
      roomNo: roomNo.trim() || 'Room 101',
      description: description.trim() || 'Active Student Batch'
    });

    setName('');
    setCode('');
    setScheduleTime('');
    setRoomNo('');
    setDescription('');
    setIsModalOpen(false);
  };

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
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Class & Batch Management</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Organize students into batches and manage class schedules effortlessly.
          </p>
        </div>

        <button onClick={() => setIsModalOpen(true)} className="btn-primary">
          <Plus size={17} /> Create New Class / Batch
        </button>
      </div>

      {/* Grid of Classes */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '1.25rem'
      }}>
        {classes.map(cls => {
          const classStudents = students.filter(s => s.className === cls.name);
          const paidCount = classStudents.filter(s => s.feeStatus === 'paid').length;

          return (
            <div key={cls.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1.25rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>{cls.name}</h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      Code: {cls.code}
                    </span>
                  </div>
                  <span className="badge badge-present" style={{ fontSize: '0.75rem' }}>
                    Active
                  </span>
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  {cls.description}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.825rem', background: 'var(--bg-app)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Users size={14} style={{ color: 'var(--primary)' }} />
                    <span><strong>Enrolled Students:</strong> {classStudents.length} Students</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Clock size={14} style={{ color: 'var(--primary)' }} />
                    <span><strong>Schedule:</strong> {cls.scheduleTime}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MapPin size={14} style={{ color: 'var(--primary)' }} />
                    <span><strong>Location:</strong> {cls.roomNo}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onSelectClassFilter(cls.name)}
                className="btn-secondary"
                style={{ width: '100%', justifyContent: 'center', fontSize: '0.85rem' }}
              >
                View Students in {cls.name}
              </button>
            </div>
          );
        })}
      </div>

      {/* Add Class Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Create New Class or Batch</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreate}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                    Class Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Class 11-A"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-app)'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                      Schedule Time
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 08:00 AM - 01:30 PM"
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.85rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-color)',
                        background: 'var(--bg-app)'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                      Room / Hall No
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Room 302"
                      value={roomNo}
                      onChange={(e) => setRoomNo(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.85rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-color)',
                        background: 'var(--bg-app)'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                    Description
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Physics & Science Stream"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-app)'
                    }}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
