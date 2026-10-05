import React from 'react';
import { 
  LayoutDashboard, 
  CalendarCheck2, 
  Users, 
  CreditCard, 
  BookOpen, 
  FileSpreadsheet
} from 'lucide-react';
import { ActiveTab } from '../types';

interface NavigationProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  attendanceCountToday: { present: number; absent: number; total: number };
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  attendanceCountToday
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { 
      id: 'attendance', 
      label: 'Attendance', 
      icon: CalendarCheck2,
      badge: `${attendanceCountToday.present}/${attendanceCountToday.total}`
    },
    { id: 'students', label: 'Student Directory', icon: Users },
    { id: 'fees', label: 'Fee Payments', icon: CreditCard },
    { id: 'classes', label: 'Classes & Batches', icon: BookOpen },
    { id: 'sheets', label: 'Google Sheets', icon: FileSpreadsheet }
  ];

  return (
    <nav style={{
      width: '240px',
      background: 'var(--bg-surface)',
      borderRight: '1px solid var(--border-color)',
      padding: '1.5rem 1rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.35rem',
      flexShrink: 0
    }}>
      <div style={{
        fontSize: '0.725rem',
        fontWeight: 700,
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        padding: '0 0.75rem 0.5rem 0.75rem'
      }}>
        Navigation
      </div>

      {navItems.map(item => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as ActiveTab)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.7rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              fontWeight: isActive ? 700 : 500,
              fontSize: '0.9rem',
              color: isActive ? 'var(--primary)' : 'var(--text-main)',
              background: isActive ? 'var(--primary-light)' : 'transparent',
              textAlign: 'left',
              transition: 'all 0.15s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Icon size={18} style={{ color: isActive ? 'var(--primary)' : 'var(--text-muted)' }} />
              <span>{item.label}</span>
            </div>

            {item.badge && (
              <span style={{
                fontSize: '0.725rem',
                fontWeight: 700,
                padding: '0.15rem 0.5rem',
                borderRadius: 'var(--radius-full)',
                background: isActive ? 'var(--primary)' : 'var(--bg-surface-subtle)',
                color: isActive ? 'white' : 'var(--text-muted)'
              }}>
                {item.badge}
              </span>
            )}
          </button>
        );
      })}

      {/* Footer Info Box */}
      <div style={{
        marginTop: 'auto',
        padding: '1rem',
        borderRadius: 'var(--radius-md)',
        background: 'var(--bg-surface-subtle)',
        border: '1px solid var(--border-color)',
        fontSize: '0.775rem',
        color: 'var(--text-muted)'
      }}>
        <p style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.25rem' }}>✨ Pro Tip</p>
        <p>Changes saved locally and automatically ready to sync with your Google Sheet.</p>
      </div>
    </nav>
  );
};
