import React from 'react';
import { Smartphone, Monitor, Shield, Zap } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <div style={{
      margin: '24px auto 32px',
      maxWidth: 960,
      padding: '36px 32px',
      borderRadius: 'var(--radius-card)',
      background: 'linear-gradient(135deg, rgba(234, 229, 255, 0.7) 0%, rgba(221, 235, 255, 0.6) 100%)',
      border: '1px solid rgba(118, 103, 201, 0.15)',
      boxShadow: 'var(--shadow-subtle)',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 14px',
        borderRadius: 999,
        background: '#ffffff',
        color: 'var(--primary-dark)',
        fontSize: 13,
        fontWeight: 700,
        marginBottom: 16,
        boxShadow: '0 2px 8px rgba(118, 103, 201, 0.1)',
      }}>
        <Zap size={14} color="var(--primary)" />
        <span>نقل محلي فوري فائق السرعة • بدون استهلاك باقة الإنترنت</span>
      </div>

      <h1 style={{
        fontSize: 32,
        fontWeight: 800,
        color: 'var(--text-main)',
        marginBottom: 12,
        lineHeight: 1.3,
      }}>
        شارك ملفاتك، بكل سهولة وبدون سحاب.
      </h1>

      <p style={{
        fontSize: 16,
        color: 'var(--text-secondary)',
        maxWidth: 640,
        margin: '0 auto 24px',
        lineHeight: 1.6,
      }}>
        انقل الصور والفيديوهات والمستندات الضخمة بين هاتفك الأندرويد والكمبيوتر مباشرة عبر الشبكة المحلية، أو أنشئ روابط مؤقتة مشفرة تشاركها عن بعد.
      </p>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '24px',
        flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)', fontSize: 14, fontWeight: 600 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Smartphone size={16} color="var(--primary)" />
          </div>
          <span>هاتف أندرويد</span>
        </div>

        <span style={{ color: 'var(--primary)', fontWeight: 700 }}>⇄</span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)', fontSize: 14, fontWeight: 600 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Monitor size={16} color="var(--primary)" />
          </div>
          <span>متصفح الكمبيوتر</span>
        </div>

        <div style={{ width: 1, height: 20, background: 'var(--border)' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--success)', fontSize: 14, fontWeight: 600 }}>
          <Shield size={16} />
          <span>ملفاتك لا تُرفع لأي خادم أثناء النقل المحلي</span>
        </div>
      </div>
    </div>
  );
};

