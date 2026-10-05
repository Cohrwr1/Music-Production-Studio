import React, { useState, useEffect } from 'react';
import { X, User, Phone, Mail, MapPin, Calendar, CreditCard, Hash } from 'lucide-react';
import { Student } from '../types';

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (student: Partial<Student>) => void;
  studentToEdit?: Student | null;
  classes: string[];
}

export const StudentModal: React.FC<StudentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  studentToEdit,
  classes
}) => {
  const [formData, setFormData] = useState<Partial<Student>>({
    name: '',
    rollNumber: '',
    className: classes[0] || 'Class 10-A',
    parentName: '',
    parentPhone: '',
    studentPhone: '',
    email: '',
    address: '',
    monthlyFee: 2500,
    feeStatus: 'paid',
    joiningDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (studentToEdit) {
      setFormData(studentToEdit);
    } else {
      setFormData({
        name: '',
        rollNumber: `${Math.floor(100 + Math.random() * 900)}`,
        className: classes[0] || 'Class 10-A',
        parentName: '',
        parentPhone: '',
        studentPhone: '',
        email: '',
        address: '',
        monthlyFee: 2500,
        feeStatus: 'paid',
        joiningDate: new Date().toISOString().split('T')[0]
      });
    }
  }, [studentToEdit, isOpen, classes]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.rollNumber || !formData.className) {
      alert('Please fill in student name, roll number, and class.');
      return;
    }
    onSave(formData);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
            {studentToEdit ? 'Edit Student Details' : 'Add New Student'}
          </h3>
          <button onClick={onClose} style={{ color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Name & Roll No Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                  Full Student Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aarav Sharma"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                  Roll Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 101"
                  value={formData.rollNumber || ''}
                  onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
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

            {/* Class & Monthly Fee */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                  Class / Batch *
                </label>
                <select
                  value={formData.className || ''}
                  onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-app)'
                  }}
                >
                  {classes.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                  Monthly Fee (₹)
                </label>
                <input
                  type="number"
                  placeholder="2500"
                  value={formData.monthlyFee || 2500}
                  onChange={(e) => setFormData({ ...formData, monthlyFee: Number(e.target.value) })}
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

            {/* Parent Info */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                  Parent / Guardian Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mr. Rajesh Sharma"
                  value={formData.parentName || ''}
                  onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
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
                  Parent Contact Number *
                </label>
                <input
                  type="text"
                  placeholder="+91 9876543210"
                  value={formData.parentPhone || ''}
                  onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
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

            {/* Email & Address */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                  Student Email
                </label>
                <input
                  type="email"
                  placeholder="student@example.com"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                  Joining Date
                </label>
                <input
                  type="date"
                  value={formData.joiningDate || ''}
                  onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
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
                Residential Address
              </label>
              <textarea
                rows={2}
                placeholder="Enter student home address..."
                value={formData.address || ''}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
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
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {studentToEdit ? 'Save Changes' : 'Add Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
