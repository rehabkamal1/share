import React, { useState, useEffect } from 'react';
import { Download, Lock, FileText, CheckCircle2, AlertTriangle, KeyRound, Archive } from 'lucide-react';
import { CloudShareApiClient, ShareMetadataResponse } from '../services/apiClient';
import { formatBytes, formatDuration } from '@shareflow/shared';

interface DownloadLinkTabProps {
  initialToken?: string;
}

export const DownloadLinkTab: React.FC<DownloadLinkTabProps> = ({ initialToken }) => {
  const [tokenInput, setTokenInput] = useState(initialToken || '');
  const [shareData, setShareData] = useState<ShareMetadataResponse | null>(null);
  const [password, setPassword] = useState('');
  const [downloadAuthToken, setDownloadAuthToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(0);

  useEffect(() => {
    if (initialToken) {
      loadShare(initialToken);
    }
  }, [initialToken]);

  useEffect(() => {
    if (!shareData) return;
    const interval = setInterval(() => {
      const rem = Math.max(0, Math.floor((shareData.expiresAt - Date.now()) / 1000));
      setSecondsRemaining(rem);
      if (rem <= 0) {
        setError('عذراً، هذا الرابط قد انتهت صلاحيته الآن وتم حذفه من الخادم.');
        setShareData(null);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [shareData]);

  const loadShare = async (tokenToLoad: string) => {
    const cleanToken = tokenToLoad.includes('/') ? tokenToLoad.split('/').pop()! : tokenToLoad.trim();
    if (!cleanToken) return;

    try {
      setIsLoading(true);
      setError(null);
      const data = await CloudShareApiClient.getShareMetadata(cleanToken);
      setShareData(data);
      setSecondsRemaining(Math.max(0, Math.floor((data.expiresAt - Date.now()) / 1000)));
      setIsLoading(false);
    } catch (err: any) {
      setIsLoading(false);
      setError(err.message || 'تعذر تحميل الرابط');
      setShareData(null);
    }
  };

  const handleAuthorize = async () => {
    if (!shareData) return;
    try {
      setIsLoading(true);
      setError(null);
      const auth = await CloudShareApiClient.authorizeDownload(shareData.token, password);
      setDownloadAuthToken(auth);
      setIsLoading(false);
    } catch (err: any) {
      setIsLoading(false);
      setError(err.message || 'كلمة المرور غير صحيحة');
    }
  };

  const handleDownloadAll = () => {
    if (!shareData) return;
    const url = CloudShareApiClient.getDownloadUrl(shareData.token, downloadAuthToken || undefined);
    window.open(url, '_blank');
  };

  const handleDownloadFile = (fileId: string) => {
    if (!shareData) return;
    const url = CloudShareApiClient.getDownloadUrl(shareData.token, downloadAuthToken || undefined, fileId);
    window.open(url, '_blank');
  };

  return (
    <div style={{ maxWidth: 760, margin: '0 auto' }}>
      <div style={{
        background: 'var(--surface)',
        borderRadius: 'var(--radius-card)',
        padding: '36px 32px',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-card)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 16,
            background: 'var(--accent-blue)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#1E40AF',
            marginBottom: 12,
          }}>
            <Download size={26} />
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-main)', marginBottom: 6 }}>
            تحميل الملفات المشتركة
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
            أدخل رمز المشاركة أو الصق الرابط للوصول للملفات وتحميلها
          </p>
        </div>

        {/* Search / Token Input Form */}
        <div style={{
          display: 'flex',
          gap: 10,
          marginBottom: 24,
          maxWidth: 580,
          margin: '0 auto 24px',
        }}>
          <input
            type="text"
            placeholder="الصق الرابط أو رمز المشاركة (Token)"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            style={{
              flex: 1,
              padding: '12px 18px',
              borderRadius: 'var(--radius-button)',
              fontSize: 14,
            }}
          />
          <button
            onClick={() => loadShare(tokenInput)}
            disabled={!tokenInput.trim() || isLoading}
            style={{
              padding: '12px 24px',
              borderRadius: 'var(--radius-button)',
              background: 'var(--primary)',
              color: '#ffffff',
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            {isLoading ? 'جاري الفحص...' : 'فتح الرابط'}
          </button>
        </div>

        {error && (
          <div style={{
            padding: '14px 18px',
            borderRadius: 'var(--radius-sm)',
            background: '#FEE2E2',
            color: 'var(--error)',
            fontSize: 14,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 24,
          }}>
            <AlertTriangle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Share Found & Rendered */}
        {shareData && (
          <div className="animate-fade-in" style={{
            padding: 24,
            borderRadius: 'var(--radius-card)',
            background: 'var(--bg-main)',
            border: '1px solid var(--border)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-main)' }}>
                  {shareData.title}
                </h3>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
                  عدد الملفات: {shareData.filesCount} • الحجم الإجمالي: {formatBytes(shareData.totalSize)}
                </div>
              </div>

              <div style={{
                padding: '6px 14px',
                borderRadius: 999,
                background: 'var(--accent-mint)',
                color: 'var(--success)',
                fontSize: 13,
                fontWeight: 700,
              }}>
                ينتهي خلال: {formatDuration(secondsRemaining)}
              </div>
            </div>

            {/* If Password Protected and not yet authorized */}
            {shareData.isPasswordProtected && !downloadAuthToken ? (
              <div style={{
                padding: 24,
                borderRadius: 'var(--radius-card)',
                background: '#ffffff',
                border: '1px solid var(--border)',
                textAlign: 'center',
                margin: '16px 0',
              }}>
                <Lock size={32} color="var(--primary)" style={{ margin: '0 auto 12px' }} />
                <h4 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', marginBottom: 6 }}>
                  هذه المشاركة محمية برقم سري
                </h4>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>
                  يرجى كتابة كلمة المرور المحددة من قبل المرسل لفك التشفير والتحميل
                </p>

                <div style={{ display: 'flex', gap: 10, maxWidth: 360, margin: '0 auto' }}>
                  <input
                    type="password"
                    placeholder="كلمة المرور"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-button)',
                      fontSize: 14,
                    }}
                  />
                  <button
                    onClick={handleAuthorize}
                    style={{
                      padding: '10px 20px',
                      borderRadius: 'var(--radius-button)',
                      background: 'var(--primary)',
                      color: '#ffffff',
                      fontSize: 14,
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <KeyRound size={16} />
                    <span>فك القفل</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Authorized or Unprotected: Files List & Download Action */
              <div>
                <div style={{
                  background: '#ffffff',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border)',
                  overflow: 'hidden',
                  marginBottom: 20,
                }}>
                  {shareData.files.map((f, i) => (
                    <div
                      key={f.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 16px',
                        borderBottom: i < shareData.files.length - 1 ? '1px solid var(--border)' : 'none',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <FileText size={18} color="var(--primary)" />
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-main)' }}>{f.name}</div>
                          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{formatBytes(f.size)}</div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDownloadFile(f.id)}
                        style={{
                          padding: '6px 14px',
                          borderRadius: 'var(--radius-sm)',
                          background: 'var(--secondary-surface)',
                          color: 'var(--primary-dark)',
                          fontSize: 13,
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                        }}
                      >
                        <Download size={14} />
                        <span>تحميل</span>
                      </button>
                    </div>
                  ))}
                </div>

                <div style={{ textAlign: 'center' }}>
                  <button
                    onClick={handleDownloadAll}
                    style={{
                      padding: '14px 36px',
                      borderRadius: 'var(--radius-button)',
                      background: 'var(--primary)',
                      color: '#ffffff',
                      fontSize: 16,
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 10,
                      boxShadow: '0 6px 20px rgba(118, 103, 201, 0.3)',
                    }}
                  >
                    <Archive size={18} />
                    <span>تحميل جميع الملفات (ملف مضغوط ZIP)</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

