import React from 'react';
import { 
  FileSpreadsheet, 
  RefreshCw, 
  PlusCircle, 
  CheckCircle2, 
  AlertCircle,
  GraduationCap
} from 'lucide-react';
import { GoogleSheetsConfig } from '../types';

interface HeaderProps {
  sheetsConfig: GoogleSheetsConfig;
  onOpenSheetsModal: () => void;
  onOpenAddStudentModal: () => void;
  onManualSync: () => void;
  isSyncing: boolean;
  totalStudents: number;
}

export const Header: React.FC<HeaderProps> = ({
  sheetsConfig,
  onOpenSheetsModal,
  onOpenAddStudentModal,
  onManualSync,
  isSyncing,
  totalStudents
}) => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <header style={{
      background: 'var(--bg-surface)',
      borderBottom: '1px solid var(--border-color)',
      padding: '0.85rem 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '1rem',
      boxShadow: 'var(--shadow-sm)'
    }}>
      {/* App Branding */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: 'var(--radius-md)',
          background: 'linear-gradient(135deg, #4F46E5, #6366F1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          boxShadow: '0 4px 10px rgba(79, 70, 229, 0.25)'
        }}>
          <GraduationCap size={24} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.25rem', lineHeight: '1.2', fontWeight: 800 }}>EduFlow</h1>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Managing {totalStudents} Students & Attendance
          </p>
        </div>
      </div>

      {/* Header Controls & Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        {/* Date Display Pill */}
        <div style={{
          padding: '0.45rem 0.85rem',
          background: 'var(--bg-surface-subtle)',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.825rem',
          fontWeight: 600,
          color: 'var(--text-muted)'
        }}>
          📅 {currentDate}
        </div>

        {/* Google Sheets Sync Pill */}
        <button
          onClick={onOpenSheetsModal}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.45rem 0.85rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.825rem',
            fontWeight: 600,
            border: '1px solid',
            background: sheetsConfig.scriptUrl ? 'var(--present-bg)' : 'var(--pending-bg)',
            color: sheetsConfig.scriptUrl ? 'var(--present-text)' : 'var(--pending-text)',
            borderColor: sheetsConfig.scriptUrl ? 'var(--present-border)' : 'var(--pending-border)'
          }}
          title="Click to configure Google Sheet connection"
        >
          <FileSpreadsheet size={15} />
          {sheetsConfig.scriptUrl ? (
            <>
              <CheckCircle2 size={13} />
              <span>Google Sheet Connected</span>
            </>
          ) : (
            <>
              <AlertCircle size={13} />
              <span>Link Google Sheet</span>
            </>
          )}
        </button>

        {/* Manual Sync Trigger */}
        {sheetsConfig.scriptUrl && (
          <button
            onClick={onManualSync}
            disabled={isSyncing}
            className="btn-secondary"
            style={{ padding: '0.45rem 0.85rem', fontSize: '0.825rem' }}
          >
            <RefreshCw size={14} style={{ animation: isSyncing ? 'spin 1s linear infinite' : 'none' }} />
            {isSyncing ? 'Syncing...' : 'Sync Now'}
          </button>
        )}

        {/* Add Student CTA */}
        <button onClick={onOpenAddStudentModal} className="btn-primary">
          <PlusCircle size={17} />
          <span>Add Student</span>
        </button>
      </div>
    </header>
  );
};
