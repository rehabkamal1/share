import React from 'react';
import { TransferProgress, formatBytes, formatSpeed, formatDuration } from '@shareflow/shared';
import { CheckCircle2, XCircle, AlertCircle, Loader2, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

interface TransferModalProps {
  progress: TransferProgress | null;
  onCancel: () => void;
  onClose: () => void;
}

export const TransferModal: React.FC<TransferModalProps> = ({ progress, onCancel, onClose }) => {
  if (!progress || progress.status === 'idle') return null;

  const isCompleted = progress.status === 'completed';
  const isFailed = progress.status === 'failed';
  const isCancelled = progress.status === 'cancelled';
  const isAwaiting = progress.status === 'awaiting_approval';
  const isTransferring = progress.status === 'transferring';

  return (
    <div className="modal-overlay">
      <div className="modal-content animate-fade-in" style={{
        maxWidth: 520,
        textAlign: 'center',
      }}>
        {/* Status Icon */}
        <div style={{ margin: '0 auto 16px' }}>
          {isTransferring && (
            <div style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'var(--primary-soft)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
            }}>
              {progress.direction === 'outgoing' ? <ArrowUpRight size={32} /> : <ArrowDownLeft size={32} />}
            </div>
          )}

          {isAwaiting && (
            <div style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'var(--accent-blue)',
              color: '#1E40AF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
            }}>
              <Loader2 size={32} className="animate-spin" />
            </div>
          )}

          {isCompleted && (
            <div style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'var(--accent-mint)',
              color: 'var(--success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
            }}>
              <CheckCircle2 size={36} />
            </div>
          )}

          {(isFailed || isCancelled) && (
            <div style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: '#FEE2E2',
              color: 'var(--error)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
            }}>
              {isCancelled ? <XCircle size={36} /> : <AlertCircle size={36} />}
            </div>
          )}
        </div>

        {/* Status Title */}
        <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-main)', marginBottom: 8 }}>
          {isAwaiting && 'بانتظار موافقة الطرف الآخر...'}
          {isTransferring && (progress.direction === 'outgoing' ? 'جاري إرسال الملفات...' : 'جاري استلام الملفات...')}
          {isCompleted && 'تم النقل بنجاح!'}
          {isCancelled && 'تم إلغاء عملية النقل'}
          {isFailed && 'فشل نقل الملفات'}
        </h3>

        {/* Current File / Subtitle */}
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 24 }}>
          {isTransferring && progress.files[progress.currentFileIndex] && (
            <span>
              الملف ({progress.currentFileIndex + 1} من {progress.files.length}):{' '}
              <strong>{progress.files[progress.currentFileIndex].name}</strong>
            </span>
          )}
          {isCompleted && 'تم حفظ كافة الملفات على جهازك بنجاح وبأعلى سرعة.'}
          {isCancelled && 'تم إنهاء الجلسة بناءً على طلب أحد الطرفين.'}
          {isFailed && (progress.errorMessage || 'حدث انقطاع في الاتصال أو رفض غير متوقع.')}
        </p>

        {/* Progress Bar & Metrics */}
        {(isTransferring || isCompleted) && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 700, marginBottom: 8 }}>
              <span>{formatBytes(progress.transferredBytes)} / {formatBytes(progress.totalBytes)}</span>
              <span style={{ color: 'var(--primary-dark)' }}>{progress.percentage}%</span>
            </div>
            <div style={{ height: 12, background: 'var(--secondary-surface)', borderRadius: 999, overflow: 'hidden' }}>
              <div style={{
                width: `${progress.percentage}%`,
                height: '100%',
                background: 'linear-gradient(90deg, var(--primary) 0%, var(--primary-dark) 100%)',
                transition: 'width 0.15s ease',
              }} />
            </div>

            {/* Speed & ETA */}
            {isTransferring && (
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: 12,
                fontSize: 13,
                color: 'var(--text-secondary)',
                fontWeight: 600,
              }}>
                <span>السرعة الحالية: {formatSpeed(progress.speedBps)}</span>
                <span>المتبقي: {formatDuration(progress.remainingSeconds)}</span>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
          {isTransferring && (
            <button
              onClick={onCancel}
              style={{
                padding: '10px 24px',
                borderRadius: 'var(--radius-button)',
                background: '#FEE2E2',
                color: 'var(--error)',
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              إلغاء النقل
            </button>
          )}

          {(isCompleted || isCancelled || isFailed) && (
            <button
              onClick={onClose}
              style={{
                padding: '10px 32px',
                borderRadius: 'var(--radius-button)',
                background: 'var(--primary)',
                color: '#ffffff',
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              إغلاق
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

