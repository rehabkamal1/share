import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { QRPairingPayload, DeviceInfo } from '@shareflow/shared';
import { Smartphone, CheckCircle, Copy, Check, Wifi, Settings2 } from 'lucide-react';

interface ReceiveTabProps {
  myDetails: {
    id: string;
    pin: string;
    name: string;
    deviceType: 'computer';
    wsUrl: string;
  };
  pairedDevice: DeviceInfo | null;
}

const isLocalHostname = (host: string) => {
  return (
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host.startsWith('192.168.') ||
    host.startsWith('10.') ||
    host.startsWith('172.') ||
    host.endsWith('.local')
  );
};

export const ReceiveTab: React.FC<ReceiveTabProps> = ({ myDetails, pairedDevice }) => {
  const [copied, setCopied] = useState(false);
  const isOnCloud = typeof window !== 'undefined' && !isLocalHostname(window.location.hostname);
  const [customIp, setCustomIp] = useState(() => {
    const saved = localStorage.getItem('cloudshare_lan_ip');
    if (saved) return saved;
    if (typeof window !== 'undefined' && isLocalHostname(window.location.hostname) && window.location.hostname !== 'localhost') {
      return window.location.hostname;
    }
    return '';
  });
  const [tempIp, setTempIp] = useState(customIp);
  const [showIpConfig, setShowIpConfig] = useState(isOnCloud && !customIp);

  const effectiveWsUrl = customIp.trim()
    ? `ws://${customIp.trim()}:4000/ws/signaling`
    : (isOnCloud ? 'ws://localhost:4000/ws/signaling' : myDetails.wsUrl);

  // QR Payload conforming to CloudShare Protocol
  const qrPayload: QRPairingPayload = {
    v: '1.0',
    type: 'cloudshare_pair',
    id: myDetails.id,
    name: myDetails.name,
    deviceType: 'computer',
    pin: myDetails.pin,
    wsUrl: effectiveWsUrl,
    token: myDetails.id,
  };

  const copyPin = () => {
    navigator.clipboard.writeText(myDetails.pin);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveIp = () => {
    const trimmed = tempIp.trim();
    setCustomIp(trimmed);
    localStorage.setItem('cloudshare_lan_ip', trimmed);
    setShowIpConfig(false);
  };

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
      <div className="responsive-card">
        <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-main)', marginBottom: 8 }}>
          استلام الملفات على هذا الكمبيوتر
        </h2>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', maxWidth: 580, margin: '0 auto 24px', lineHeight: 1.5 }}>
          لاستلام ملفات من كمبيوتر آخر أو من الهاتف: اكتب كود الـ PIN أدناه في خانة الإرسال بالجهاز الآخر، أو امسح رمز الـ QR من تطبيق الهاتف.
        </p>

        {pairedDevice ? (
          <div style={{
            padding: '20px 16px',
            borderRadius: 'var(--radius-card)',
            background: 'var(--accent-mint)',
            color: 'var(--success)',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            marginBottom: 24,
            textAlign: 'right',
            width: '100%',
          }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              background: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <CheckCircle size={24} color="var(--success)" />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700 }}>متصل بالهاتف: {pairedDevice.name}</div>
              <div style={{ fontSize: 13, marginTop: 2 }}>أنت جاهز الآن، يمكنك إرسال أي ملف من هاتفك ليتم حفظه تلقائياً في التنزيلات.</div>
            </div>
          </div>
        ) : (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 28,
            flexWrap: 'wrap',
            margin: '16px 0 24px',
          }}>
            {/* QR Code Container */}
            <div style={{
              padding: 16,
              background: '#ffffff',
              borderRadius: 'var(--radius-card)',
              border: '2px solid var(--primary-soft)',
              boxShadow: 'var(--shadow-subtle)',
              display: 'inline-block',
              maxWidth: '100%',
            }}>
              <QRCodeSVG
                value={JSON.stringify(qrPayload)}
                size={180}
                level="M"
                includeMargin={false}
              />
              <div style={{ marginTop: 10, fontSize: 13, fontWeight: 600, color: 'var(--primary-dark)' }}>
                امسح الرمز بكاميرا التطبيق
              </div>
            </div>

            {/* PIN Code Box */}
            <div style={{ textAlign: 'center', width: '100%', maxWidth: 300 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)' }}>
                أو أدخل رمز التحقق اليدوي (PIN):
              </span>
              <div style={{
                margin: '12px auto',
                padding: '14px 20px',
                borderRadius: 'var(--radius-button)',
                background: 'var(--secondary-surface)',
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <span style={{
                  fontSize: 28,
                  fontWeight: 800,
                  color: 'var(--primary-dark)',
                  letterSpacing: 4,
                  fontFamily: 'monospace',
                }}>
                  {myDetails.pin}
                </span>
                <button
                  onClick={copyPin}
                  title="نسخ الرمز"
                  style={{
                    background: '#ffffff',
                    border: '1px solid var(--border)',
                    padding: 8,
                    borderRadius: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-main)',
                  }}
                >
                  {copied ? <Check size={18} color="var(--success)" /> : <Copy size={18} />}
                </button>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--accent-blue)',
                color: '#1E40AF',
                fontSize: 13,
                fontWeight: 600,
              }}>
                <Smartphone size={16} />
                <span>الشبكة المحلية المشتركة (Wi-Fi)</span>
              </div>
            </div>
          </div>
        )}

        {/* LAN IP Config Box */}
        <div style={{
          margin: '16px auto 0',
          padding: '12px 18px',
          borderRadius: 14,
          background: '#f8f9fe',
          border: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
          maxWidth: 500,
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            fontSize: 13,
            color: 'var(--text-secondary)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Wifi size={16} color="var(--primary)" />
              <span>عنوان اللابتوب في الشبكة (LAN IP):</span>
              <strong style={{ color: 'var(--text-main)', direction: 'ltr' }}>
                {customIp || (typeof window !== 'undefined' && isLocalHostname(window.location.hostname) ? window.location.hostname : 'لم يتم التحديد')}
              </strong>
            </div>
            <button
              onClick={() => setShowIpConfig(!showIpConfig)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--primary)',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 12,
              }}
            >
              <Settings2 size={14} />
              <span>{showIpConfig ? 'إغلاق' : 'تعديل الـ IP'}</span>
            </button>
          </div>

          {isOnCloud && !customIp && (
            <div style={{
              fontSize: 12,
              color: '#B45309',
              background: '#FEF3C7',
              padding: '8px 12px',
              borderRadius: 8,
              textAlign: 'right',
              width: '100%',
              lineHeight: 1.5,
            }}>
              💡 أنت تتصفح من Vercel. للاقتران المباشر مع هاتفك عبر الواي فاي، أدخل عنوان IP اللابتوب أدناه (مثال: 192.168.1.15) بعد تشغيل السيرفر المحلي (<code style={{ direction: 'ltr' }}>npm run dev:api</code>).
            </div>
          )}

          {showIpConfig && (
            <div style={{ width: '100%', display: 'flex', gap: 8, marginTop: 6 }}>
              <input
                type="text"
                placeholder="مثال: 192.168.1.15"
                value={tempIp}
                onChange={(e) => setTempIp(e.target.value)}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: 8,
                  border: '1px solid #cbd5e1',
                  direction: 'ltr',
                  textAlign: 'center',
                  fontSize: 13,
                }}
              />
              <button
                onClick={handleSaveIp}
                style={{
                  padding: '8px 16px',
                  borderRadius: 8,
                  background: 'var(--primary)',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: 'pointer',
                }}
              >
                تطبيق
              </button>
            </div>
          )}
        </div>

        {/* Steps Guide */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 16,
          marginTop: 24,
          paddingTop: 24,
          borderTop: '1px solid var(--border)',
          textAlign: 'right',
        }}>
          <div style={{ padding: 12 }}>
            <div style={{ color: 'var(--primary)', fontWeight: 800, fontSize: 16, marginBottom: 4 }}>١. على الجهاز المرسل</div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>افتح CloudShare على كمبيوتر آخر أو على هاتفك، واختر تبويب "إرسال ملفات".</p>
          </div>
          <div style={{ padding: 12 }}>
            <div style={{ color: 'var(--primary)', fontWeight: 800, fontSize: 16, marginBottom: 4 }}>٢. الاقتران السريع</div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>اكتب كود الـ PIN الموضح أعلاه في الجهاز المرسل (أو امسح رمز الـ QR بكاميرا الهاتف).</p>
          </div>
          <div style={{ padding: 12 }}>
            <div style={{ color: 'var(--primary)', fontWeight: 800, fontSize: 16, marginBottom: 4 }}>٣. الاستلام التلقائي</div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>عند إرسال الملفات ستصل فوراً إلى هذا الجهاز وتُحفظ تلقائياً في مجلد التنزيلات.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

