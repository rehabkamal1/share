import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { SendTab } from './components/SendTab';
import { ReceiveTab } from './components/ReceiveTab';
import { CloudLinkTab } from './components/CloudLinkTab';
import { DownloadLinkTab } from './components/DownloadLinkTab';
import { TransferModal } from './components/TransferModal';
import { IncomingApprovalModal } from './components/IncomingApprovalModal';
import { HistoryModal } from './components/HistoryModal';
import { P2PTransferEngine } from './services/p2pClient';
import { DeviceInfo, TransferProgress, TransferHistoryItem, SharedFileItem } from '@shareflow/shared';
import { Send, Download, Link2, FolderDown } from 'lucide-react';

const p2pEngine = new P2PTransferEngine();

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'send' | 'receive' | 'cloud' | 'download'>('send');
  const [pairedDevice, setPairedDevice] = useState<DeviceInfo | null>(null);
  const [activeProgress, setActiveProgress] = useState<TransferProgress | null>(null);
  const [incomingOffer, setIncomingOffer] = useState<{
    offer: { senderName: string; files: SharedFileItem[]; totalBytes: number };
    accept: () => void;
    reject: () => void;
  } | null>(null);
  const [history, setHistory] = useState<TransferHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('shareflow_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [initialDownloadToken, setInitialDownloadToken] = useState<string | undefined>();

  // Check URL hash for direct download links e.g. /#download/<token>
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#download/')) {
      const token = hash.replace('#download/', '').trim();
      if (token) {
        setInitialDownloadToken(token);
        setActiveTab('download');
      }
    }
  }, []);

  useEffect(() => {
    p2pEngine.onPeerConnected((device) => {
      setPairedDevice(device);
    });

    p2pEngine.onPeerDisconnected(() => {
      setPairedDevice(null);
    });

    p2pEngine.onIncomingTransfer((offer, accept, reject) => {
      setIncomingOffer({ offer, accept, reject });
    });

    p2pEngine.onProgress((progress) => {
      setActiveProgress({ ...progress });

      if (progress.status === 'completed') {
        const historyItem: TransferHistoryItem = {
          id: 'hist_' + Date.now(),
          sessionId: progress.sessionId,
          direction: progress.direction,
          mode: progress.mode,
          peerName: progress.peerDevice?.name || (progress.direction === 'outgoing' ? 'الهاتف المحمول' : 'جهاز مرسل'),
          peerType: 'android',
          filesCount: progress.files.length,
          files: progress.files.map((f) => ({ name: f.name, size: f.size, mimeType: f.mimeType })),
          totalSize: progress.totalBytes,
          status: 'completed',
          timestamp: Date.now(),
          durationMs: 0,
        };

        setHistory((prev) => {
          const next = [historyItem, ...prev].slice(0, 50);
          localStorage.setItem('shareflow_history', JSON.stringify(next));
          return next;
        });
      }
    });
  }, []);

  const handleSendFiles = async (files: File[]) => {
    try {
      await p2pEngine.prepareAndSendFiles(files);
    } catch (err: any) {
      alert(err.message || 'حدث خطأ أثناء بدء النقل');
    }
  };

  const handleRequestPair = (pin: string) => {
    try {
      p2pEngine.requestPairWithPin(pin);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleAcceptIncoming = () => {
    if (incomingOffer) {
      incomingOffer.accept();
      setIncomingOffer(null);
    }
  };

  const handleRejectIncoming = () => {
    if (incomingOffer) {
      incomingOffer.reject();
      setIncomingOffer(null);
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('shareflow_history');
  };

  const tabs = [
    { id: 'send', label: 'إرسال إلى الهاتف', icon: Send },
    { id: 'receive', label: 'استلام من الهاتف', icon: Download },
    { id: 'cloud', label: 'مشاركة عبر رابط مشفر', icon: Link2 },
    { id: 'download', label: 'تحميل عبر رابط', icon: FolderDown },
  ] as const;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header
        onOpenHistory={() => setIsHistoryOpen(true)}
        isConnectedToHub={true}
      />

      <main className="main-content">
        <Hero />

        {/* Tab Selector Navigation */}
        <div className="tab-nav-container">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="tab-nav-btn"
                style={{
                  background: isActive ? 'var(--primary)' : 'var(--surface)',
                  color: isActive ? '#ffffff' : 'var(--text-main)',
                  boxShadow: isActive ? '0 4px 16px rgba(118, 103, 201, 0.3)' : 'var(--shadow-subtle)',
                  border: `1px solid ${isActive ? 'var(--primary)' : 'var(--border)'}`,
                }}
              >
                <Icon size={18} style={tab.id === 'send' ? { transform: 'rotate(-45deg)' } : undefined} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Active Tab Screen */}
        <div className="animate-fade-in">
          {activeTab === 'send' && (
            <SendTab
              pairedDevice={pairedDevice}
              onSendFiles={handleSendFiles}
              onRequestPair={handleRequestPair}
            />
          )}

          {activeTab === 'receive' && (
            <ReceiveTab
              myDetails={p2pEngine.getMyDetails()}
              pairedDevice={pairedDevice}
            />
          )}

          {activeTab === 'cloud' && <CloudLinkTab />}

          {activeTab === 'download' && <DownloadLinkTab initialToken={initialDownloadToken} />}
        </div>
      </main>

      {/* Transfer Active Progress Modal */}
      <TransferModal
        progress={activeProgress}
        onCancel={() => p2pEngine.cancelTransfer()}
        onClose={() => setActiveProgress(null)}
      />

      {/* Incoming File Transfer Approval Modal */}
      <IncomingApprovalModal
        offer={incomingOffer?.offer || null}
        onAccept={handleAcceptIncoming}
        onReject={handleRejectIncoming}
      />

      {/* History Log Modal */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onClearHistory={handleClearHistory}
      />

      {/* Footer */}
      <footer style={{
        padding: '24px 32px',
        textAlign: 'center',
        borderTop: '1px solid var(--border)',
        fontSize: 13,
        color: 'var(--text-secondary)',
        background: '#ffffff',
      }}>
        <div>ShareFlow © 2026 — تطبيق مشاركة الملفات العصري والآمن بالعربية لنظام أندرويد والويب.</div>
        <div style={{ marginTop: 4, color: 'var(--primary-dark)', fontWeight: 600 }}>
          نقل محلي فائق السرعة • خصوصية تامة • حماية مشفرة
        </div>
      </footer>
    </div>
  );
};

