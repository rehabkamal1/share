import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { QRPairingPayload, DeviceInfo } from '@shareflow/shared';
import { Smartphone, CheckCircle, Copy, Check } from 'lucide-react';

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

export const ReceiveTab: React.FC<ReceiveTabProps> = ({ myDetails, pairedDevice }) => {
  const [copied, setCopied] = useState(false);

  // QR Payload conforming to ShareFlow Protocol
  const qrPayload: QRPairingPayload = {
    v: '1.0',
    type: 'shareflow_pair',
    id: myDetails.id,
    name: myDetails.name,
    deviceType: 'computer',
    pin: myDetails.pin,
    wsUrl: myDetails.wsUrl,
    token: myDetails.id,
  };

  const copyPin = () => {
    navigator.clipboard.writeText(myDetails.pin);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
      <div className="responsive-card">
        <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-main)', marginBottom: 8 }}>
          استلام الملفات من الهاتف على الكمبيوتر
        </h2>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', maxWidth: 540, margin: '0 auto 24px', lineHeight: 1.5 }}>
          افتح تطبيق ShareFlow على هاتفك، اختر "ربط مع الكمبيوتر" ثم امسح رمز الـ QR أدناه أو اكتب كود الـ PIN.
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
            <div style={{ color: 'var(--primary)', fontWeight: 800, fontSize: 16, marginBottom: 4 }}>١. على الهاتف</div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>اضغط على أيقونة "ربط مع الكمبيوتر" في الصفحة الرئيسية لتطبيق الهاتف.</p>
          </div>
          <div style={{ padding: 12 }}>
            <div style={{ color: 'var(--primary)', fontWeight: 800, fontSize: 16, marginBottom: 4 }}>٢. المسح والاقتران</div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>وجّه الكاميرا نحو رمز الـ QR أو اكتب رمز الـ PIN الموضح أعلاه.</p>
          </div>
          <div style={{ padding: 12 }}>
            <div style={{ color: 'var(--primary)', fontWeight: 800, fontSize: 16, marginBottom: 4 }}>٣. الاستلام التلقائي</div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>عند إرسال الملفات ستصل فوراً إلى متصفحك وتُحفظ في مجلد التنزيلات.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

