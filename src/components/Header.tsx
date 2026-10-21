import React from 'react';
import { Send, History, ShieldCheck, Wifi } from 'lucide-react';

interface HeaderProps {
  onOpenHistory: () => void;
  isConnectedToHub: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onOpenHistory, isConnectedToHub }) => {
  return (
    <header className="site-header">
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <img
          src="/logo.png"
          alt="CloudShare Logo"
          style={{
            width: 38,
            height: 38,
            borderRadius: 12,
            boxShadow: '0 4px 12px rgba(40, 24, 87, 0.25)',
            objectFit: 'cover',
            flexShrink: 0,
          }}
        />
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-main)', letterSpacing: -0.5 }}>
              CloudShare
            </span>
            <span style={{
              fontSize: 10,
              fontWeight: 700,
              background: 'var(--primary-soft)',
              color: 'var(--primary-dark)',
              padding: '2px 7px',
              borderRadius: 20,
            }}>
              الويب
            </span>
          </div>
          <span className="hide-on-small" style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
            مشاركة سريعة وآمنة
          </span>
        </div>
      </div>

      {/* Status & Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 10px',
          borderRadius: 20,
          background: isConnectedToHub ? 'var(--accent-mint)' : '#FEE2E2',
          color: isConnectedToHub ? 'var(--success)' : 'var(--error)',
          fontSize: 12,
          fontWeight: 600,
        }}>
          <Wifi size={14} />
          <span className="hide-on-small">{isConnectedToHub ? 'الشبكة جاهزة' : 'جاري الاتصال'}</span>
        </div>

        <button
          onClick={onOpenHistory}
          title="سجل النقل"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '7px 12px',
            borderRadius: 'var(--radius-button)',
            background: 'var(--secondary-surface)',
            color: 'var(--text-main)',
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          <History size={15} />
          <span className="hide-on-mobile">سجل النقل</span>
        </button>

        <div className="hide-on-mobile" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          color: 'var(--primary)',
          fontSize: 13,
          fontWeight: 600,
          padding: '0 4px',
        }}>
          <ShieldCheck size={17} />
          <span>خصوصية 100%</span>
        </div>
      </div>
    </header>
  );
};

