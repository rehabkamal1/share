import React, { useState, useRef } from 'react';
import { Upload, Link2, Lock, Clock, Check, Copy, Trash2, Shield, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { CloudShareApiClient } from '../services/apiClient';
import { formatBytes } from '@shareflow/shared';

export const CloudLinkTab: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [expiry, setExpiry] = useState<number>(60);
  const [password, setPassword] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [createdShare, setCreatedShare] = useState<{ token: string; link: string; expiresAt: number } | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showQr, setShowQr] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
      setErrorMessage(null);
    }
  };

  const removeFile = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const totalSize = files.reduce((acc, f) => acc + f.size, 0);

  const handleCreateShare = async () => {
    if (files.length === 0) {
      setErrorMessage('يرجى اختيار ملف واحد على الأقل للرفع');
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);
      setErrorMessage(null);

      // 1. Create share metadata on API
      const record = await CloudShareApiClient.createShare({
        title: files.length === 1 ? files[0].name : `${files[0].name} و ${files.length - 1} ملفات أخرى`,
        expiresInMinutes: expiry,
        password: password.trim() || undefined,
      });

      // 2. Upload files with progress
      await CloudShareApiClient.uploadFiles(record.token, files, (pct) => {
        setUploadProgress(pct);
      });

      const fullLink = `${window.location.origin}/#download/${record.token}`;
      setCreatedShare({
        token: record.token,
        link: fullLink,
        expiresAt: record.expiresAt,
      });
      setIsUploading(false);
    } catch (err: any) {
      setIsUploading(false);
      setErrorMessage(err.message || 'حدث خطأ أثناء رفع ومشاركة الملفات');
    }
  };

  const copyToClipboard = () => {
    if (createdShare) {
      navigator.clipboard.writeText(createdShare.link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRevoke = async () => {
    if (!createdShare) return;
    try {
      await CloudShareApiClient.deleteShare(createdShare.token);
      setCreatedShare(null);
      setFiles([]);
      setPassword('');
      alert('تم حذف الرابط وإلغاء صلاحيته فوراً.');
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <div className="responsive-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: 'var(--primary-soft)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary)',
            flexShrink: 0,
          }}>
            <Link2 size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-main)' }}>
              مشاركة الملفات عبر رابط سحابي آمن
            </h2>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              ارفع ملفاتك وشاركها مع أي شخص في العالم برابط مشفر ينتهي تلقائياً
            </p>
          </div>
        </div>

        {errorMessage && (
          <div style={{
            margin: '16px 0',
            padding: '12px 16px',
            borderRadius: 'var(--radius-sm)',
            background: '#FEE2E2',
            color: 'var(--error)',
            fontSize: 14,
            fontWeight: 600,
          }}>
            {errorMessage}
          </div>
        )}

        {/* If Share Created Successfully */}
        {createdShare ? (
          <div style={{ marginTop: 24, textAlign: 'center' }} className="animate-fade-in">
            <div style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: 'var(--accent-mint)',
              color: 'var(--success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}>
              <Check size={32} />
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-main)', marginBottom: 8 }}>
              رابط المشاركة الآمن جاهز الآن!
            </h3>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 24 }}>
              يمكن لأي شخص فتح هذا الرابط في متصفحه لتحميل الملفات المرفوعة قبل انتهاء الوقت.
            </p>

            {/* Link Copy Box */}
            <div className="responsive-form-row" style={{
              padding: '10px 14px',
              borderRadius: 'var(--radius-button)',
              background: 'var(--secondary-surface)',
              border: '1px solid var(--border)',
              maxWidth: 600,
              margin: '0 auto 20px',
            }}>
              <input
                type="text"
                readOnly
                value={createdShare.link}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  fontSize: 13,
                  fontWeight: 600,
                  direction: 'ltr',
                  textAlign: 'left',
                  color: 'var(--primary-dark)',
                  outline: 'none',
                  boxShadow: 'none',
                  minWidth: 0,
                }}
              />
              <button
                onClick={copyToClipboard}
                style={{
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-button)',
                  background: 'var(--primary)',
                  color: '#ffffff',
                  fontSize: 13,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  flexShrink: 0,
                }}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                <span>{copied ? 'تم النسخ' : 'نسخ الرابط'}</span>
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
              <button
                onClick={() => setShowQr(!showQr)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-button)',
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-main)',
                  fontSize: 13,
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <QrCode size={16} />
                <span>{showQr ? 'إخفاء رمز QR' : 'إظهار رمز QR للرابط'}</span>
              </button>

              <button
                onClick={handleRevoke}
                style={{
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-button)',
                  background: '#FEE2E2',
                  color: 'var(--error)',
                  fontSize: 13,
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <Trash2 size={16} />
                <span>إلغاء وحذف الرابط فوراً</span>
              </button>
            </div>

            {showQr && (
              <div style={{
                padding: 16,
                background: '#ffffff',
                borderRadius: 'var(--radius-card)',
                display: 'inline-block',
                border: '1px solid var(--border)',
                marginBottom: 24,
              }}>
                <QRCodeSVG value={createdShare.link} size={180} />
              </div>
            )}

            <div>
              <button
                onClick={() => { setCreatedShare(null); setFiles([]); }}
                style={{
                  padding: '10px 24px',
                  borderRadius: 'var(--radius-button)',
                  background: 'var(--secondary-surface)',
                  color: 'var(--text-main)',
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                إنشاء رابط جديد
              </button>
            </div>
          </div>
        ) : (
          /* File Selection & Config Form */
          <div style={{ marginTop: 24 }}>
            {/* File Dropzone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: '2px dashed var(--border)',
                borderRadius: 'var(--radius-card)',
                padding: '36px 20px',
                textAlign: 'center',
                background: 'var(--bg-main)',
                cursor: 'pointer',
                marginBottom: 20,
              }}
            >
              <input
                type="file"
                ref={fileInputRef}
                multiple
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <Upload size={32} color="var(--primary)" style={{ margin: '0 auto 10px' }} />
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', marginBottom: 4 }}>
                اضغط لاختيار الملفات للرفع السحابي
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                الحد الأقصى لكل ملف: 500 م.بايت • الحصة المتاحة: 2 ج.بايت
              </div>
            </div>

            {/* Selected files list */}
            {files.length > 0 && (
              <div style={{
                background: 'var(--bg-main)',
                borderRadius: 'var(--radius-card)',
                padding: 12,
                marginBottom: 20,
                maxHeight: 180,
                overflowY: 'auto',
              }}>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, color: 'var(--text-main)' }}>
                  الملفات المحددة ({files.length}) — {formatBytes(totalSize)}
                </div>
                {files.map((f, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '6px 10px',
                      background: '#ffffff',
                      borderRadius: 8,
                      marginBottom: 4,
                      fontSize: 13,
                    }}
                  >
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '75%' }}>
                      {f.name} ({formatBytes(f.size)})
                    </span>
                    <button onClick={() => removeFile(i)} style={{ color: 'var(--error)', background: 'transparent' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Expiry and Password Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 16,
              marginBottom: 24,
            }}>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 700, color: 'var(--text-main)', marginBottom: 8 }}>
                  <Clock size={16} color="var(--primary)" />
                  <span>مدة صلاحية الرابط:</span>
                </label>
                <select
                  value={expiry}
                  onChange={(e) => setExpiry(Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-button)',
                    fontSize: 14,
                    background: '#ffffff',
                  }}
                >
                  <option value={15}>15 دقيقة</option>
                  <option value={60}>ساعة واحدة (مستحسن)</option>
                  <option value={1440}>24 ساعة (يوم كامل)</option>
                  <option value={4320}>3 أيام</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 700, color: 'var(--text-main)', marginBottom: 8 }}>
                  <Lock size={16} color="var(--primary)" />
                  <span>حماية بكلمة مرور (اختياري):</span>
                </label>
                <input
                  type="password"
                  placeholder="اتركها فارغة بدون قفل"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-button)',
                    fontSize: 14,
                    background: '#ffffff',
                  }}
                />
              </div>
            </div>

            {/* Upload Progress Bar if active */}
            {isUploading && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 700, marginBottom: 6 }}>
                  <span>جاري رفع وتشفير الملفات...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div style={{ height: 10, background: 'var(--secondary-surface)', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{
                    width: `${uploadProgress}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, var(--primary) 0%, var(--primary-dark) 100%)',
                    transition: 'width 0.2s ease',
                  }} />
                </div>
              </div>
            )}

            {/* Action Button */}
            <div style={{ textAlign: 'center' }}>
              <button
                onClick={handleCreateShare}
                disabled={isUploading || files.length === 0}
                className="responsive-btn"
                style={{
                  padding: '14px 40px',
                  borderRadius: 'var(--radius-button)',
                  background: 'var(--primary)',
                  color: '#ffffff',
                  fontSize: 15,
                  fontWeight: 700,
                  opacity: isUploading || files.length === 0 ? 0.6 : 1,
                  boxShadow: '0 6px 20px rgba(118, 103, 201, 0.3)',
                  cursor: isUploading || files.length === 0 ? 'not-allowed' : 'pointer',
                }}
              >
                <Upload size={18} />
                <span>{isUploading ? 'جاري الرفع والمعالجة...' : 'توليد رابط المشاركة المشفر'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

