import React, { useState, useRef } from 'react';
import { UploadCloud, File, Trash2, Smartphone, Monitor, Send, CheckCircle2 } from 'lucide-react';
import { formatBytes, DeviceInfo } from '@shareflow/shared';

interface SendTabProps {
  pairedDevice: DeviceInfo | null;
  onSendFiles: (files: File[]) => void;
  onRequestPair: (pin: string) => void;
}

export const SendTab: React.FC<SendTabProps> = ({ pairedDevice, onSendFiles, onRequestPair }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [targetPin, setTargetPin] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const arr = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...arr]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const arr = Array.from(e.dataTransfer.files);
      setSelectedFiles((prev) => [...prev, ...arr]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const totalBytes = selectedFiles.reduce((acc, f) => acc + f.size, 0);

  const handleSend = () => {
    if (selectedFiles.length === 0) return;
    onSendFiles(selectedFiles);
  };

  const handlePairSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (targetPin.trim().length >= 4) {
      onRequestPair(targetPin.trim());
    }
  };

  return (
    <div style={{ maxWidth: 840, margin: '0 auto' }}>
      {/* Device Pairing Bar */}
      <div className="responsive-card" style={{
        marginBottom: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: '1 1 280px' }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: pairedDevice ? 'var(--accent-mint)' : 'var(--primary-soft)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: pairedDevice ? 'var(--success)' : 'var(--primary)',
            flexShrink: 0,
          }}>
            {pairedDevice?.type === 'computer' ? <Monitor size={22} /> : <Smartphone size={22} />}
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-main)' }}>
              {pairedDevice ? `متصل بـ: ${pairedDevice.name}` : 'غير مقترن بجهاز بعد'}
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              {pairedDevice
                ? 'الجهاز جاهز لاستقبال الملفات بأقصى سرعة للشبكة المحلية'
                : 'أدخل رمز الـ PIN الظاهر على الجهاز الآخر (كمبيوتر أو هاتف) للاقتران فوراً'}
            </div>
          </div>
        </div>

        {!pairedDevice && (
          <form onSubmit={handlePairSubmit} className="responsive-form-row" style={{ flex: '1 1 auto', justifyContent: 'flex-end' }}>
            <input
              type="text"
              placeholder="رمز PIN (مثال: 481920)"
              value={targetPin}
              onChange={(e) => setTargetPin(e.target.value)}
              style={{
                padding: '9px 14px',
                borderRadius: 'var(--radius-button)',
                fontSize: 14,
                width: 170,
                textAlign: 'center',
                letterSpacing: 1.5,
              }}
            />
            <button
              type="submit"
              disabled={!targetPin.trim()}
              style={{
                padding: '9px 20px',
                borderRadius: 'var(--radius-button)',
                background: 'var(--primary)',
                color: '#ffffff',
                fontSize: 14,
                fontWeight: 600,
                opacity: targetPin.trim() ? 1 : 0.6,
              }}
            >
              اقتران
            </button>
          </form>
        )}

        {pairedDevice && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--success)', fontSize: 13, fontWeight: 700 }}>
            <CheckCircle2 size={16} />
            <span>جاهز للإرسال</span>
          </div>
        )}
      </div>

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: `2px dashed ${isDragging ? 'var(--primary)' : 'var(--border)'}`,
          borderRadius: 'var(--radius-card)',
          padding: '36px 16px',
          textAlign: 'center',
          background: isDragging ? 'var(--primary-soft)' : 'var(--surface)',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: 'var(--shadow-subtle)',
        }}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple
          style={{ display: 'none' }}
        />
        <div style={{
          width: 56,
          height: 56,
          borderRadius: 18,
          background: 'var(--primary-soft)',
          color: 'var(--primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 14px',
        }}>
          <UploadCloud size={28} />
        </div>
        <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-main)', marginBottom: 6 }}>
          اضغط لاختيار الملفات أو اسحبها وأفلتها هنا
        </h3>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
          يدعم جميع الصور، الفيديوهات عالية الدقة، المستندات، والملفات المضغوطة
        </p>
      </div>

      {/* Selected Files Preview */}
      {selectedFiles.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 12,
            flexWrap: 'wrap',
            gap: 8,
          }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-main)' }}>
              الملفات المختارة ({selectedFiles.length})
            </div>
            <div style={{ fontSize: 13, color: 'var(--primary-dark)', fontWeight: 600 }}>
              الحجم الإجمالي: {formatBytes(totalBytes)}
            </div>
          </div>

          <div style={{
            maxHeight: 280,
            overflowY: 'auto',
            background: 'var(--surface)',
            borderRadius: 'var(--radius-card)',
            border: '1px solid var(--border)',
            padding: 8,
          }}>
            {selectedFiles.map((file, idx) => (
              <div
                key={`${file.name}_${idx}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  background: idx % 2 === 0 ? 'var(--secondary-surface)' : 'transparent',
                  gap: 8,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0, overflow: 'hidden' }}>
                  <File size={18} color="var(--primary)" style={{ flexShrink: 0 }} />
                  <span className="responsive-file-name">
                    {file.name}
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)', flexShrink: 0 }}>
                    ({formatBytes(file.size)})
                  </span>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                  style={{ background: 'transparent', color: 'var(--error)', padding: 6, borderRadius: 6, flexShrink: 0 }}
                  title="حذف الملف"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 20, textAlign: 'center' }}>
            <button
              onClick={handleSend}
              disabled={!pairedDevice}
              className="responsive-btn"
              style={{
                padding: '14px 40px',
                borderRadius: 'var(--radius-button)',
                background: pairedDevice ? 'var(--primary)' : '#CBD5E1',
                color: '#ffffff',
                fontSize: 15,
                fontWeight: 700,
                boxShadow: pairedDevice ? '0 6px 20px rgba(118, 103, 201, 0.35)' : 'none',
                cursor: pairedDevice ? 'pointer' : 'not-allowed',
              }}
            >
              <Send size={18} style={{ transform: 'rotate(-45deg)' }} />
              <span>إرسال الملفات الآن إلى الهاتف</span>
            </button>
            {!pairedDevice && (
              <div style={{ fontSize: 13, color: 'var(--error)', marginTop: 8 }}>
                * يرجى إقران الكمبيوتر بهاتفك أولاً قبل بدء النقل
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

