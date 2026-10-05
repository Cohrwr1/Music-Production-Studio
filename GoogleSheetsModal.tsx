import React, { useState } from 'react';
import { 
  X, 
  FileSpreadsheet, 
  Copy, 
  Check, 
  RefreshCw, 
  Upload, 
  Download, 
  ExternalLink,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { GoogleSheetsConfig, Student, AttendanceRecord, FeePayment } from '../types';
import { googleSheetsService, APPS_SCRIPT_TEMPLATE } from '../services/googleSheets';

interface GoogleSheetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: GoogleSheetsConfig;
  onSaveConfig: (config: GoogleSheetsConfig) => void;
  students: Student[];
  attendanceRecords: AttendanceRecord[];
  feePayments: FeePayment[];
  onImportStudents: (students: Partial<Student>[]) => void;
  onManualSync: () => void;
  isSyncing: boolean;
}

export const GoogleSheetsModal: React.FC<GoogleSheetsModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  students,
  attendanceRecords,
  feePayments,
  onImportStudents,
  onManualSync,
  isSyncing
}) => {
  const [scriptUrl, setScriptUrl] = useState(config.scriptUrl || '');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'webhook' | 'csv'>('webhook');

  if (!isOpen) return null;

  const handleCopyScript = () => {
    navigator.clipboard.writeText(APPS_SCRIPT_TEMPLATE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveUrl = () => {
    if (!scriptUrl.trim()) {
      alert('Please enter a valid Google Apps Script Web App URL');
      return;
    }

    onSaveConfig({
      ...config,
      scriptUrl: scriptUrl.trim(),
      status: 'connected',
      lastSyncedAt: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString()
    });

    onManualSync();
  };

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        const parsed = googleSheetsService.parseStudentsCSV(text);
        if (parsed.length > 0) {
          onImportStudents(parsed);
          alert(`Successfully imported ${parsed.length} students from CSV!`);
          onClose();
        } else {
          alert('Could not find student rows in the uploaded CSV file.');
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '680px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              padding: '0.4rem',
              borderRadius: 'var(--radius-md)',
              background: '#ECFDF5',
              color: '#047857'
            }}>
              <FileSpreadsheet size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Google Sheet Database Connector</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Store and sync all student info, attendance, and fees directly in your Google Sheet
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Tab switch */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid var(--border-color)',
          background: 'var(--bg-app)',
          padding: '0 1.5rem'
        }}>
          <button
            onClick={() => setActiveTab('webhook')}
            style={{
              padding: '0.75rem 1rem',
              fontSize: '0.875rem',
              fontWeight: 700,
              borderBottom: activeTab === 'webhook' ? '2px solid var(--primary)' : '2px solid transparent',
              color: activeTab === 'webhook' ? 'var(--primary)' : 'var(--text-muted)'
            }}
          >
            ⚡ Automatic Live Sync (Google Apps Script)
          </button>
          <button
            onClick={() => setActiveTab('csv')}
            style={{
              padding: '0.75rem 1rem',
              fontSize: '0.875rem',
              fontWeight: 700,
              borderBottom: activeTab === 'csv' ? '2px solid var(--primary)' : '2px solid transparent',
              color: activeTab === 'csv' ? 'var(--primary)' : 'var(--text-muted)'
            }}
          >
            📄 CSV Import / Export
          </button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {activeTab === 'webhook' ? (
            <>
              {/* Status Banner */}
              <div style={{
                background: config.scriptUrl ? 'var(--present-bg)' : 'var(--pending-bg)',
                border: '1px solid',
                borderColor: config.scriptUrl ? 'var(--present-border)' : 'var(--pending-border)',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem 1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  {config.scriptUrl ? (
                    <CheckCircle2 size={18} style={{ color: 'var(--present-text)' }} />
                  ) : (
                    <Sparkles size={18} style={{ color: 'var(--pending-text)' }} />
                  )}
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: config.scriptUrl ? 'var(--present-text)' : 'var(--pending-text)' }}>
                    {config.scriptUrl 
                      ? `Google Sheet linked! ${config.lastSyncedAt ? 'Last synced: ' + config.lastSyncedAt : ''}` 
                      : 'Connect your Google Sheet to store all app database records automatically.'}
                  </span>
                </div>

                {config.scriptUrl && (
                  <button
                    onClick={onManualSync}
                    disabled={isSyncing}
                    className="btn-primary"
                    style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                  >
                    <RefreshCw size={14} style={{ animation: isSyncing ? 'spin 1s linear infinite' : 'none' }} />
                    {isSyncing ? 'Syncing...' : 'Sync Now'}
                  </button>
                )}
              </div>

              {/* Step 1: Script Copy */}
              <div style={{ background: 'var(--bg-app)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>
                    Step 1: Copy Google Apps Script Code
                  </h4>
                  <button
                    onClick={handleCopyScript}
                    className="btn-secondary"
                    style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                  >
                    {copied ? <Check size={14} style={{ color: 'green' }} /> : <Copy size={14} />}
                    <span>{copied ? 'Copied Code!' : 'Copy Script Code'}</span>
                  </button>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  In your Google Sheet, click <strong>Extensions &gt; Apps Script</strong>, clear any existing code, paste this snippet, and click <strong>Deploy &gt; Web App</strong>.
                </p>
              </div>

              {/* Step 2: Paste Web App URL */}
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.35rem' }}>
                  Step 2: Paste your Deployed Google Web App URL
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="url"
                    placeholder="https://script.google.com/macros/s/.../exec"
                    value={scriptUrl}
                    onChange={(e) => setScriptUrl(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-app)',
                      fontSize: '0.85rem'
                    }}
                  />
                  <button onClick={handleSaveUrl} className="btn-primary" style={{ whiteSpace: 'nowrap' }}>
                    Connect Sheet
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* CSV Import / Export Tab */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ background: 'var(--bg-app)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                  📥 Import Students from existing Google Sheet CSV
                </h4>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
                  Export your Google Sheet as a CSV file and upload it here to import all student records into EduFlow.
                </p>
                
                <label className="btn-secondary" style={{ display: 'inline-flex', cursor: 'pointer' }}>
                  <Upload size={16} /> Choose CSV File
                  <input type="file" accept=".csv" onChange={handleCSVUpload} style={{ display: 'none' }} />
                </label>
              </div>

              <div style={{ background: 'var(--bg-app)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                  📤 Export Database CSVs for Google Sheets
                </h4>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
                  Download current student directory, attendance logs, and fee records formatted for Google Sheets.
                </p>

                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => {
                      const headers = ['ID', 'Roll No', 'Name', 'Class', 'Parent Name', 'Parent Phone', 'Email', 'Monthly Fee', 'Fee Status', 'Joining Date'];
                      const rows = students.map(s => [s.id, s.rollNumber, s.name, s.className, s.parentName, s.parentPhone, s.email || '', s.monthlyFee, s.feeStatus, s.joiningDate]);
                      googleSheetsService.exportToCSV('Students_Directory', headers, rows);
                    }}
                    className="btn-secondary"
                    style={{ fontSize: '0.8rem' }}
                  >
                    <Download size={14} /> Export Students CSV
                  </button>

                  <button
                    onClick={() => {
                      const headers = ['Record ID', 'Date', 'Class', 'Student ID', 'Status'];
                      const rows: any[][] = [];
                      attendanceRecords.forEach(rec => {
                        Object.entries(rec.records).forEach(([sId, st]) => {
                          rows.push([rec.id, rec.date, rec.className, sId, st]);
                        });
                      });
                      googleSheetsService.exportToCSV('Attendance_Records', headers, rows);
                    }}
                    className="btn-secondary"
                    style={{ fontSize: '0.8rem' }}
                  >
                    <Download size={14} /> Export Attendance CSV
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn-secondary">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
