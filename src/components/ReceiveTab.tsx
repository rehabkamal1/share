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
      <div style={{
        background: 'var(--surface)',
        borderRadius: 'var(--radius-card)',
        padding: '36px 32px',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-card)',
      }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-main)', marginBottom: 8 }}>
          استلام الملفات من الهاتف على الكمبيوتر
        </h2>
        <p style={{ fontSize: 15, color: 'var(--text-secondary)', maxWidth: 540, margin: '0 auto 28px' }}>
          افتح تطبيق ShareFlow على هاتفك، اختر "ربط مع الكمبيوتر" ثم امسح رمز الـ QR أدناه أو اكتب كود الـ PIN.
        </p>

        {pairedDevice ? (
          <div style={{
            padding: '24px',
            borderRadius: 'var(--radius-card)',
            background: 'var(--accent-mint)',
            color: 'var(--success)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 16,
            marginBottom: 24,
          }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: 16,
              background: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <CheckCircle size={28} color="var(--success)" />
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 18, fontWeight: 700 }}>متصل بالهاتف: {pairedDevice.name}</div>
              <div style={{ fontSize: 14 }}>أنت جاهز الآن، يمكنك إرسال أي ملف من هاتفك ليتم حفظه تلقائياً في التنزيلات.</div>
            </div>
          </div>
        ) : (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 40,
            flexWrap: 'wrap',
            margin: '20px 0 32px',
          }}>
            {/* QR Code Container */}
            <div style={{
              padding: 20,
              background: '#ffffff',
              borderRadius: 'var(--radius-card)',
              border: '2px solid var(--primary-soft)',
              boxShadow: 'var(--shadow-subtle)',
              display: 'inline-block',
            }}>
              <QRCodeSVG
                value={JSON.stringify(qrPayload)}
                size={210}
                level="M"
                includeMargin={false}
              />
              <div style={{ marginTop: 12, fontSize: 13, fontWeight: 600, color: 'var(--primary-dark)' }}>
                امسح الرمز بكاميرا التطبيق
              </div>
            </div>

            {/* PIN Code Box */}
            <div style={{ textAlign: 'right', minWidth: 260 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)' }}>
                أو أدخل رمز التحقق اليدوي (PIN):
              </span>
              <div style={{
                margin: '12px 0',
                padding: '16px 24px',
                borderRadius: 'var(--radius-button)',
                background: 'var(--secondary-surface)',
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <span style={{
                  fontSize: 32,
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
                    borderRadius: 8,
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

