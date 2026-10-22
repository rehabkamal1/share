import React from 'react';
import { Smartphone, Monitor, Shield, Zap } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <div className="hero-card">
      <div className="hero-badge">
        <Zap size={14} color="var(--primary)" />
        <span>نقل محلي فوري فائق السرعة • بدون استهلاك باقة الإنترنت</span>
      </div>

      <h1 className="hero-title">
        شارك ملفاتك، بكل سهولة وبدون سحاب.
      </h1>

      <p className="hero-desc">
        انقل الصور والفيديوهات والمستندات الضخمة بين أجهزة الكمبيوتر والهواتف مباشرة عبر الشبكة المحلية (Wi-Fi)، أو أنشئ روابط مؤقتة مشفرة تشاركها عن بعد.
      </p>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        flexWrap: 'wrap',
        margin: '0 auto',
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '6px 12px',
          borderRadius: 20,
          background: '#ffffff',
          color: 'var(--text-main)',
          fontSize: 12,
          fontWeight: 700,
          boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
        }}>
          <Monitor size={14} color="var(--primary)" />
          <span>كمبيوتر</span>
        </div>

        <span style={{ color: 'var(--primary)', fontWeight: 800 }}>⇄</span>

        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '6px 12px',
          borderRadius: 20,
          background: '#ffffff',
          color: 'var(--text-main)',
          fontSize: 12,
          fontWeight: 700,
          boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
        }}>
          <Monitor size={14} color="var(--primary)" />
          <span>كمبيوتر آخر</span>
        </div>

        <span style={{ color: 'var(--primary)', fontWeight: 800 }}>⇄</span>

        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '6px 12px',
          borderRadius: 20,
          background: '#ffffff',
          color: 'var(--text-main)',
          fontSize: 12,
          fontWeight: 700,
          boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
        }}>
          <Smartphone size={14} color="var(--primary)" />
          <span>هاتف أندرويد</span>
        </div>

        <div className="hide-on-mobile" style={{ width: 1, height: 16, background: 'var(--border)' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--success)', fontSize: 12, fontWeight: 700 }}>
          <Shield size={14} />
          <span>نقل محلي مشفر 100%</span>
        </div>
      </div>
    </div>
  );
};

