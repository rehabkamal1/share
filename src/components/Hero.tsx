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
        gap: '16px',
        flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)', fontSize: 13, fontWeight: 600 }}>
          <div style={{ width: 26, height: 26, borderRadius: 8, background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Monitor size={15} color="var(--primary)" />
          </div>
          <span>كمبيوتر</span>
        </div>

        <span style={{ color: 'var(--primary)', fontWeight: 700 }}>⇄</span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)', fontSize: 13, fontWeight: 600 }}>
          <div style={{ width: 26, height: 26, borderRadius: 8, background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Monitor size={15} color="var(--primary)" />
          </div>
          <span>كمبيوتر آخر</span>
        </div>

        <span style={{ color: 'var(--primary)', fontWeight: 700 }}>⇄</span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)', fontSize: 13, fontWeight: 600 }}>
          <div style={{ width: 26, height: 26, borderRadius: 8, background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Smartphone size={15} color="var(--primary)" />
          </div>
          <span>هاتف أندرويد</span>
        </div>

        <div className="hide-on-mobile" style={{ width: 1, height: 16, background: 'var(--border)' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--success)', fontSize: 13, fontWeight: 600 }}>
          <Shield size={15} />
          <span>ملفاتك لا تُرفع لأي خادم أثناء النقل المحلي</span>
        </div>
      </div>
    </div>
  );
};

