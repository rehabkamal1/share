import React from 'react';
import { SharedFileItem, formatBytes } from '@shareflow/shared';
import { Smartphone, Download, X } from 'lucide-react';

interface IncomingApprovalModalProps {
  offer: {
    senderName: string;
    files: SharedFileItem[];
    totalBytes: number;
  } | null;
  onAccept: () => void;
  onReject: () => void;
}

export const IncomingApprovalModal: React.FC<IncomingApprovalModalProps> = ({ offer, onAccept, onReject }) => {
  if (!offer) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(41, 40, 58, 0.65)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 110,
      padding: 16,
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: 'var(--radius-card)',
        padding: '32px 28px',
        width: '100%',
        maxWidth: 480,
        boxShadow: 'var(--shadow-float)',
        textAlign: 'center',
      }} className="animate-fade-in">
        <div style={{
          width: 56,
          height: 56,
          borderRadius: 18,
          background: 'var(--primary-soft)',
          color: 'var(--primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
        }}>
          <Smartphone size={30} />
        </div>

        <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-main)', marginBottom: 8 }}>
          طلب استلام ملفات جديد
        </h3>

        <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 20 }}>
          يرغب الجهاز <strong>{offer.senderName}</strong> في إرسال مجموعة من الملفات إليك:
        </p>

        <div style={{
          background: 'var(--bg-main)',
          borderRadius: 'var(--radius-card)',
          padding: 16,
          marginBottom: 24,
          textAlign: 'right',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 700, marginBottom: 10 }}>
            <span>عدد الملفات: {offer.files.length}</span>
            <span style={{ color: 'var(--primary-dark)' }}>الحجم: {formatBytes(offer.totalBytes)}</span>
          </div>

          <div style={{ maxHeight: 140, overflowY: 'auto' }}>
            {offer.files.map((f, i) => (
              <div key={i} style={{ fontSize: 13, color: 'var(--text-main)', padding: '4px 0', borderBottom: '1px solid var(--border)' }}>
                {f.name} ({formatBytes(f.size)})
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button
            onClick={onAccept}
            style={{
              flex: 1,
              padding: '12px 24px',
              borderRadius: 'var(--radius-button)',
              background: 'var(--success)',
              color: '#ffffff',
              fontSize: 15,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <Download size={18} />
            <span>قبول واستلام</span>
          </button>

          <button
            onClick={onReject}
            style={{
              padding: '12px 20px',
              borderRadius: 'var(--radius-button)',
              background: '#FEE2E2',
              color: 'var(--error)',
              fontSize: 15,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <X size={18} />
            <span>رفض</span>
          </button>
        </div>
      </div>
    </div>
  );
};

