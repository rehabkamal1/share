/**
 * CloudShare Shared Types & Transfer State Machine
 */

export type TransferStatus =
  | 'idle'
  | 'selecting'
  | 'connecting'
  | 'awaiting_approval'
  | 'preparing'
  | 'transferring'
  | 'paused'
  | 'completed'
  | 'cancelled'
  | 'failed';

export type TransferDirection = 'outgoing' | 'incoming';

export type TransferMode = 'local_p2p' | 'local_companion' | 'cloud_link';

export type DeviceType = 'android' | 'computer' | 'ios' | 'web';

export interface DeviceInfo {
  id: string;
  name: string;
  type: DeviceType;
  model?: string;
  platform?: string;
  ipAddress?: string;
  port?: number;
  lastSeen?: number;
}

export interface SharedFileItem {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  uri?: string;            // Local path on mobile / URL or local blob
  lastModified?: number;
  hash?: string;
  relativePath?: string;
}

export interface TransferProgress {
  sessionId: string;
  status: TransferStatus;
  direction: TransferDirection;
  mode: TransferMode;
  peerDevice?: DeviceInfo;
  files: SharedFileItem[];
  currentFileIndex: number;
  totalBytes: number;
  transferredBytes: number;
  percentage: number;
  speedBps: number;
  remainingSeconds: number;
  errorMessage?: string;
  startedAt?: number;
  completedAt?: number;
}

export interface TransferHistoryItem {
  id: string;
  sessionId: string;
  direction: TransferDirection;
  mode: TransferMode;
  peerName: string;
  peerType: DeviceType;
  filesCount: number;
  files: Array<{
    name: string;
    size: number;
    mimeType: string;
  }>;
  totalSize: number;
  status: 'completed' | 'cancelled' | 'failed';
  timestamp: number;
  durationMs: number;
}

export interface CloudShareItem {
  id: string;
  token: string;
  title: string;
  totalSize: number;
  filesCount: number;
  files: Array<{
    id: string;
    name: string;
    size: number;
    mimeType: string;
  }>;
  createdAt: number;
  expiresAt: number;
  isPasswordProtected: boolean;
  downloadCount: number;
  maxDownloads?: number;
  status: 'active' | 'expired' | 'revoked';
}

export interface CreateSharePayload {
  title?: string;
  password?: string;
  expiresInMinutes?: number; // e.g. 15, 60, 1440 (24h), 4320 (3d)
  maxDownloads?: number;
}

