import React, { useState, useEffect } from 'react';
import { X, CreditCard, CheckCircle2 } from 'lucide-react';
import { Student, FeePayment } from '../types';

interface FeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRecordPayment: (payment: Partial<FeePayment>) => void;
  selectedStudent?: Student | null;
  students: Student[];
}

export const FeeModal: React.FC<FeeModalProps> = ({
  isOpen,
  onClose,
  onRecordPayment,
  selectedStudent,
  students
}) => {
  const [studentId, setStudentId] = useState<string>('');
  const [amount, setAmount] = useState<number>(2500);
  const [monthFor, setMonthFor] = useState<string>('October 2026');
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'UPI' | 'Bank Transfer' | 'Card' | 'Cheque'>('UPI');
  const [receiptNo, setReceiptNo] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    if (selectedStudent) {
      setStudentId(selectedStudent.id);
      setAmount(selectedStudent.monthlyFee);
    } else if (students.length > 0) {
      setStudentId(students[0].id);
      setAmount(students[0].monthlyFee);
    }
    setReceiptNo(`REC-${Math.floor(100000 + Math.random() * 900000)}`);
  }, [selectedStudent, students, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const st = students.find(s => s.id === studentId);
    if (!st) return;

    onRecordPayment({
      studentId: st.id,
      studentName: st.name,
      className: st.className,
      amount,
      date: new Date().toISOString().split('T')[0],
      monthFor,
      paymentMethod,
      receiptNo,
      notes
    });

    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Record Fee Payment</h3>
          <button onClick={onClose} style={{ color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Student Select */}
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                Select Student *
              </label>
              <select
                value={studentId}
                onChange={(e) => {
                  setStudentId(e.target.value);
                  const st = students.find(s => s.id === e.target.value);
                  if (st) setAmount(st.monthlyFee);
                }}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-app)',
                  fontWeight: 600
                }}
              >
                {students.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.className} - Roll #{s.rollNumber})
                  </option>
                ))}
              </select>
            </div>

            {/* Amount & Month */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                  Amount Paid (₹) *
                </label>
                <input
                  type="number"
                  required
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-app)',
                    fontWeight: 700
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                  For Month / Term *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. October 2026"
                  value={monthFor}
                  onChange={(e) => setMonthFor(e.target.value)}
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

            {/* Method & Receipt No */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-app)'
                  }}
                >
                  <option value="UPI">UPI / GPay / PhonePe</option>
                  <option value="Cash">Cash</option>
                  <option value="Bank Transfer">Bank Transfer (NEFT/IMPS)</option>
                  <option value="Card">Credit / Debit Card</option>
                  <option value="Cheque">Cheque</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                  Receipt Number
                </label>
                <input
                  type="text"
                  value={receiptNo}
                  readOnly
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-surface-subtle)',
                    color: 'var(--text-muted)',
                    fontWeight: 600
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                Optional Payment Note
              </label>
              <input
                type="text"
                placeholder="e.g. Transaction ID / Received by office"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
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
              <CheckCircle2 size={16} /> Confirm Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
