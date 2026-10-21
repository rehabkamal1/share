/**
 * CloudShare Peer-to-Peer & Local Companion Transfer Protocol
 */

import { DeviceInfo, SharedFileItem } from './types';

export const PROTOCOL_VERSION = '1.0';
export const CHUNK_SIZE = 64 * 1024; // 64 KB per chunk for optimal WebRTC / WebSocket streaming
export const DEFAULT_LOCAL_PORT = 49152; // Ephemeral port range
export const DEFAULT_EXPIRY_MINUTES = 60; // 1 hour default

export interface QRPairingPayload {
  v: string;             // Protocol version e.g. "1.0"
  type: 'cloudshare_pair' | 'shareflow_pair';
  id: string;            // Device or session UUID
  name: string;          // Device friendly name
  deviceType: 'android' | 'computer' | 'web';
  pin?: string;          // 6-digit verification PIN
  wsUrl?: string;        // Local signaling or direct URL
  ip?: string;           // Local LAN IP
  port?: number;         // Local port
  token: string;         // Single-use authentication token
}

export type SignalingMessageType =
  | 'pair_request'
  | 'pair_response'
  | 'transfer_offer'
  | 'transfer_accept'
  | 'transfer_reject'
  | 'chunk_ready'
  | 'chunk_ack'
  | 'transfer_cancel'
  | 'transfer_complete'
  | 'error'
  | 'ping'
  | 'pong';

export interface SignalingMessage {
  type: SignalingMessageType;
  sessionId: string;
  sender: DeviceInfo;
  timestamp: number;
  payload?: any;
}

export interface PairRequestPayload {
  device: DeviceInfo;
  pin: string;
}

export interface PairResponsePayload {
  accepted: boolean;
  reason?: string;
  device: DeviceInfo;
}

export interface TransferOfferPayload {
  transferId: string;
  files: SharedFileItem[];
  totalBytes: number;
  senderName: string;
}

export interface TransferResponsePayload {
  transferId: string;
  accepted: boolean;
  reason?: string;
}

export interface ChunkHeader {
  transferId: string;
  fileIndex: number;
  chunkIndex: number;
  totalChunks: number;
  byteOffset: number;
  chunkSize: number;
  isLastChunk: boolean;
}

