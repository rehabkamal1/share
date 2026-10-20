import React from 'react';
import { Send, History, ShieldCheck, Wifi } from 'lucide-react';

interface HeaderProps {
  onOpenHistory: () => void;
  isConnectedToHub: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onOpenHistory, isConnectedToHub }) => {
  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 32px',
      background: 'rgba(255, 255, 255, 0.85)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 40,
    }}>
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          width: 44,
          height: 44,
          borderRadius: 14,
          background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(118, 103, 201, 0.25)',
          color: '#ffffff',
        }}>
          <Send size={22} style={{ transform: 'rotate(-45deg)' }} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-main)', letterSpacing: -0.5 }}>
              ShareFlow
            </span>
            <span style={{
              fontSize: 11,
              fontWeight: 700,
              background: 'var(--primary-soft)',
              color: 'var(--primary-dark)',
              padding: '2px 8px',
              borderRadius: 20,
            }}>
              الكمبيوتر
            </span>
          </div>
          <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
            مشاركة الملفات بسرعة وأمان فائق
          </span>
        </div>
      </div>

      {/* Status & Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 14px',
          borderRadius: 20,
          background: isConnectedToHub ? 'var(--accent-mint)' : '#FEE2E2',
          color: isConnectedToHub ? 'var(--success)' : 'var(--error)',
          fontSize: 13,
          fontWeight: 600,
        }}>
          <Wifi size={15} />
          <span>{isConnectedToHub ? 'الشبكة المحلية جاهزة' : 'جاري الاتصال بالشبكة'}</span>
        </div>

        <button
          onClick={onOpenHistory}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: 'var(--radius-button)',
            background: 'var(--secondary-surface)',
            color: 'var(--text-main)',
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          <History size={16} />
          <span>سجل النقل</span>
        </button>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          color: 'var(--primary)',
          fontSize: 13,
          fontWeight: 600,
          padding: '0 8px',
        }}>
          <ShieldCheck size={18} />
          <span>خصوصية 100%</span>
        </div>
      </div>
    </header>
  );
};

