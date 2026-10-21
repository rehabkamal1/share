import React from 'react';
import { TransferHistoryItem, formatBytes } from '@shareflow/shared';
import { X, ArrowUpRight, ArrowDownLeft, Trash2, CheckCircle, Clock } from 'lucide-react';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: TransferHistoryItem[];
  onClearHistory: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose, history, onClearHistory }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content animate-fade-in" style={{
        maxWidth: 580,
        maxHeight: '85vh',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-main)' }}>
            سجل عمليات النقل
          </h3>
          <button onClick={onClose} style={{ background: 'transparent', color: 'var(--text-secondary)' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', marginBottom: 16 }}>
          {history.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 16px', color: 'var(--text-secondary)' }}>
              <Clock size={40} color="var(--primary-soft)" style={{ margin: '0 auto 12px' }} />
              <div style={{ fontSize: 16, fontWeight: 700 }}>لا توجد عمليات نقل سابقة</div>
              <div style={{ fontSize: 13, marginTop: 4 }}>ستظهر جميع الملفات المرسلة والمستلمة هنا تلقائياً</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {history.map((item) => (
                <div
                  key={item.id}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-main)',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 10,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
                    <div style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: item.direction === 'outgoing' ? 'var(--primary-soft)' : 'var(--accent-mint)',
                      color: item.direction === 'outgoing' ? 'var(--primary)' : 'var(--success)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      {item.direction === 'outgoing' ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="responsive-file-name">
                        {item.files[0]?.name || 'ملف'}
                        {item.filesCount > 1 && ` (+${item.filesCount - 1})`}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                        {item.direction === 'outgoing' ? 'إرسال إلى' : 'استلام من'}: {item.peerName} • {formatBytes(item.totalSize)}
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'left' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--success)', fontSize: 12, fontWeight: 700 }}>
                      <CheckCircle size={14} />
                      <span>مكتمل</span>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>
                      {new Date(item.timestamp).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {history.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: 16 }}>
            <button
              onClick={onClearHistory}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: 'transparent',
                color: 'var(--error)',
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              <Trash2 size={15} />
              <span>مسح السجل بالكامل</span>
            </button>

            <button
              onClick={onClose}
              style={{
                padding: '8px 20px',
                borderRadius: 'var(--radius-button)',
                background: 'var(--primary)',
                color: '#ffffff',
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              تم
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

