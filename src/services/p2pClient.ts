/**
 * CloudShare P2P WebRTC & WebSocket Local Transfer Engine for Browser Companion
 */

import {
  CHUNK_SIZE,
  DeviceInfo,
  SharedFileItem,
  TransferProgress,
  TransferStatus,
  generatePinCode,
} from '@shareflow/shared';

export type TransferEventCallback = (progress: TransferProgress) => void;
export type IncomingTransferCallback = (
  offer: { senderName: string; files: SharedFileItem[]; totalBytes: number },
  accept: () => void,
  reject: () => void
) => void;

export class P2PTransferEngine {
  private ws: WebSocket | null = null;
  private peerConnection: RTCPeerConnection | null = null;
  private dataChannel: RTCDataChannel | null = null;
  private peerId: string = 'web_' + Math.random().toString(36).substring(2, 9);
  private myPin: string = generatePinCode();
  private pairedPeerId: string | null = null;
  private wsUrl: string = 'ws://localhost:4000/ws/signaling';
  private isConnectedToHub: boolean = false;

  // Active transfer state
  private activeTransfer: TransferProgress | null = null;
  private onProgressCallback: TransferEventCallback | null = null;
  private onIncomingCallback: IncomingTransferCallback | null = null;
  private onPeerConnectedCallback: ((device: DeviceInfo) => void) | null = null;
  private onPeerDisconnectedCallback: (() => void) | null = null;

  // Receiving file assembly
  private receivedChunks: ArrayBuffer[] = [];
  private receivedBytesCurrentFile = 0;
  private currentReceivingFile: SharedFileItem | null = null;
  private receivingFilesList: SharedFileItem[] = [];
  private receivingFileIndex = 0;
  private totalReceivingBytes = 0;
  private totalReceivedBytes = 0;
  private transferStartTime = 0;

  constructor() {
    // Generate persistent or session pin
    this.init();
  }

  public init(customWsUrl?: string) {
    if (customWsUrl) this.wsUrl = customWsUrl;
    this.connectSignaling();
  }

  public getMyDetails() {
    return {
      id: this.peerId,
      pin: this.myPin,
      name: 'متصفح الكمبيوتر (CloudShare Companion)',
      deviceType: 'computer' as const,
      wsUrl: this.wsUrl,
    };
  }

  public onProgress(cb: TransferEventCallback) {
    this.onProgressCallback = cb;
  }

  public onIncomingTransfer(cb: IncomingTransferCallback) {
    this.onIncomingCallback = cb;
  }

  public onPeerConnected(cb: (device: DeviceInfo) => void) {
    this.onPeerConnectedCallback = cb;
  }

  public onPeerDisconnected(cb: () => void) {
    this.onPeerDisconnectedCallback = cb;
  }

  private connectSignaling() {
    try {
      this.ws = new WebSocket(this.wsUrl);

      this.ws.onopen = () => {
        this.isConnectedToHub = true;
        this.ws?.send(
          JSON.stringify({
            type: 'register',
            payload: {
              id: this.peerId,
              pin: this.myPin,
              deviceType: 'computer',
              deviceName: 'متصفح الكمبيوتر (CloudShare Companion)',
            },
          })
        );
      };

      this.ws.onmessage = async (event) => {
        try {
          const msg = JSON.parse(event.data);
          await this.handleSignalingMessage(msg);
        } catch (e) {
          console.error('[P2P] Parse signaling message error:', e);
        }
      };

      this.ws.onclose = () => {
        this.isConnectedToHub = false;
        setTimeout(() => this.connectSignaling(), 4000);
      };

      this.ws.onerror = (err) => {
        console.warn('[P2P] WebSocket error:', err);
      };
    } catch (e) {
      console.warn('[P2P] Could not initiate WebSocket:', e);
    }
  }

  private async handleSignalingMessage(msg: any) {
    const { type, payload } = msg;

    switch (type) {
      case 'incoming_pair_request': {
        const { requesterId, requesterInfo } = payload;
        // Accept incoming pairing automatically or trigger approval
        this.ws?.send(
          JSON.stringify({
            type: 'pair_accept',
            payload: { targetId: requesterId },
          })
        );
        break;
      }

      case 'pair_connected': {
        this.pairedPeerId = payload.peerId;
        if (this.onPeerConnectedCallback) {
          this.onPeerConnectedCallback({
            id: payload.peerId,
            name: payload.deviceName || 'جهاز الهاتف المحمول',
            type: payload.deviceType || 'android',
          });
        }
        break;
      }

      case 'peer_disconnected': {
        this.pairedPeerId = null;
        if (this.onPeerDisconnectedCallback) {
          this.onPeerDisconnectedCallback();
        }
        break;
      }

      case 'transfer_offer': {
        const { transferId, files, totalBytes, senderName } = payload;
        this.receivingFilesList = files;
        this.totalReceivingBytes = totalBytes;
        this.totalReceivedBytes = 0;
        this.receivingFileIndex = 0;

        if (this.onIncomingCallback) {
          this.onIncomingCallback(
            { senderName, files, totalBytes },
            () => this.acceptIncomingTransfer(transferId),
            () => this.rejectIncomingTransfer(transferId)
          );
        } else {
          this.acceptIncomingTransfer(transferId);
        }
        break;
      }

      case 'transfer_response': {
        if (payload.accepted) {
          this.startSendingFiles();
        } else {
          this.updateProgress({
            status: 'failed',
            errorMessage: payload.reason || 'تم رفض النقل من الطرف الآخر',
          });
        }
        break;
      }

      case 'chunk_data': {
        this.handleReceivedChunk(payload);
        break;
      }

      case 'transfer_cancel': {
        this.updateProgress({
          status: 'cancelled',
          errorMessage: 'تم إلغاء النقل من الجهاز الآخر',
        });
        break;
      }

      case 'transfer_complete': {
        this.updateProgress({
          status: 'completed',
          percentage: 100,
          transferredBytes: this.totalReceivingBytes,
        });
        break;
      }
    }
  }

  public requestPairWithPin(targetPin: string) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error('غير متصل بخادم الإشارات المحلي');
    }

    this.ws.send(
      JSON.stringify({
        type: 'pair_request',
        payload: {
          targetPin,
          requesterInfo: {
            id: this.peerId,
            name: 'متصفح الكمبيوتر',
            deviceType: 'computer',
          },
        },
      })
    );
  }

  public acceptIncomingTransfer(transferId: string) {
    if (!this.pairedPeerId) return;
    this.ws?.send(
      JSON.stringify({
        type: 'transfer_response',
        payload: { targetId: this.pairedPeerId, transferId, accepted: true },
      })
    );

    this.transferStartTime = Date.now();
    this.currentReceivingFile = this.receivingFilesList[0] || null;
    this.receivedChunks = [];
    this.receivedBytesCurrentFile = 0;

    this.updateProgress({
      sessionId: transferId,
      status: 'transferring',
      direction: 'incoming',
      mode: 'local_companion',
      files: this.receivingFilesList,
      currentFileIndex: 0,
      totalBytes: this.totalReceivingBytes,
      transferredBytes: 0,
      percentage: 0,
      speedBps: 0,
      remainingSeconds: 0,
    });
  }

  public rejectIncomingTransfer(transferId: string) {
    if (!this.pairedPeerId) return;
    this.ws?.send(
      JSON.stringify({
        type: 'transfer_response',
        payload: { targetId: this.pairedPeerId, transferId, accepted: false, reason: 'رفض المستخدم الطلب' },
      })
    );
  }

  private handleReceivedChunk(payload: {
    chunkIndex: number;
    fileIndex: number;
    base64Data: string;
    isLastChunk: boolean;
  }) {
    const binaryStr = atob(payload.base64Data);
    const len = binaryStr.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }
    this.receivedChunks.push(bytes.buffer);
    this.receivedBytesCurrentFile += len;
    this.totalReceivedBytes += len;

    const elapsed = Math.max(0.1, (Date.now() - this.transferStartTime) / 1000);
    const speed = this.totalReceivedBytes / elapsed;
    const remainingBytes = Math.max(0, this.totalReceivingBytes - this.totalReceivedBytes);
    const remainingSeconds = speed > 0 ? Math.ceil(remainingBytes / speed) : 0;
    const percentage = Math.min(100, Math.round((this.totalReceivedBytes / this.totalReceivingBytes) * 100));

    this.updateProgress({
      status: 'transferring',
      transferredBytes: this.totalReceivedBytes,
      percentage,
      speedBps: Math.round(speed),
      remainingSeconds,
      currentFileIndex: payload.fileIndex,
    });

    if (payload.isLastChunk) {
      // Assemble and save file to browser downloads
      const curFile = this.receivingFilesList[payload.fileIndex];
      const blob = new Blob(this.receivedChunks, { type: curFile?.mimeType || 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = curFile?.name || 'CloudShare_file';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      this.receivedChunks = [];
      this.receivedBytesCurrentFile = 0;

      if (payload.fileIndex + 1 < this.receivingFilesList.length) {
        this.receivingFileIndex = payload.fileIndex + 1;
        this.currentReceivingFile = this.receivingFilesList[this.receivingFileIndex];
      } else {
        // All files received
        this.updateProgress({
          status: 'completed',
          percentage: 100,
          transferredBytes: this.totalReceivingBytes,
        });
      }
    }
  }

  // SENDING FILES
  private filesToSend: File[] = [];
  public async prepareAndSendFiles(files: File[]) {
    if (!this.pairedPeerId) {
      throw new Error('يجب الاقتران بهاتف أولاً قبل إرسال الملفات');
    }

    this.filesToSend = files;
    const sharedFiles: SharedFileItem[] = files.map((f, idx) => ({
      id: `f_${idx}_${Date.now()}`,
      name: f.name,
      size: f.size,
      mimeType: f.type || 'application/octet-stream',
    }));

    const totalBytes = files.reduce((acc, f) => acc + f.size, 0);
    const transferId = 'tx_' + Date.now();

    this.updateProgress({
      sessionId: transferId,
      status: 'awaiting_approval',
      direction: 'outgoing',
      mode: 'local_companion',
      files: sharedFiles,
      currentFileIndex: 0,
      totalBytes,
      transferredBytes: 0,
      percentage: 0,
      speedBps: 0,
      remainingSeconds: 0,
    });

    // Send transfer offer
    this.ws?.send(
      JSON.stringify({
        type: 'transfer_offer',
        payload: {
          targetId: this.pairedPeerId,
          transferId,
          files: sharedFiles,
          totalBytes,
          senderName: 'متصفح الكمبيوتر',
        },
      })
    );
  }

  private async startSendingFiles() {
    if (!this.activeTransfer || !this.pairedPeerId) return;

    this.updateProgress({ status: 'transferring' });
    this.transferStartTime = Date.now();
    let totalBytesSent = 0;

    for (let fIdx = 0; fIdx < this.filesToSend.length; fIdx++) {
      const file = this.filesToSend[fIdx];
      let offset = 0;
      let chunkIdx = 0;

      while (offset < file.size) {
        if (this.activeTransfer?.status === 'cancelled') {
          return;
        }

        const slice = file.slice(offset, offset + CHUNK_SIZE);
        const buffer = await slice.arrayBuffer();
        const bytes = new Uint8Array(buffer);
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        const base64Data = btoa(binary);

        offset += slice.size;
        totalBytesSent += slice.size;
        const isLastChunk = offset >= file.size;

        this.ws?.send(
          JSON.stringify({
            type: 'chunk_data',
            payload: {
              targetId: this.pairedPeerId,
              fileIndex: fIdx,
              chunkIndex: chunkIdx++,
              base64Data,
              isLastChunk,
            },
          })
        );

        const elapsed = Math.max(0.1, (Date.now() - this.transferStartTime) / 1000);
        const speed = totalBytesSent / elapsed;
        const remainingBytes = Math.max(0, this.activeTransfer.totalBytes - totalBytesSent);
        const remainingSeconds = speed > 0 ? Math.ceil(remainingBytes / speed) : 0;
        const percentage = Math.min(100, Math.round((totalBytesSent / this.activeTransfer.totalBytes) * 100));

        this.updateProgress({
          transferredBytes: totalBytesSent,
          percentage,
          speedBps: Math.round(speed),
          remainingSeconds,
          currentFileIndex: fIdx,
        });

        // Allow micro-pause for smooth browser UI loop
        await new Promise((r) => setTimeout(r, 10));
      }
    }

    this.updateProgress({
      status: 'completed',
      percentage: 100,
      transferredBytes: this.activeTransfer.totalBytes,
    });

    this.ws?.send(
      JSON.stringify({
        type: 'transfer_complete',
        payload: { targetId: this.pairedPeerId },
      })
    );
  }

  public cancelTransfer() {
    if (this.pairedPeerId) {
      this.ws?.send(
        JSON.stringify({
          type: 'transfer_cancel',
          payload: { targetId: this.pairedPeerId },
        })
      );
    }
    this.updateProgress({ status: 'cancelled' });
  }

  private updateProgress(partial: Partial<TransferProgress>) {
    if (!this.activeTransfer) {
      this.activeTransfer = {
        sessionId: 'tx_' + Date.now(),
        status: partial.status || 'idle',
        direction: 'outgoing',
        mode: 'local_companion',
        files: [],
        currentFileIndex: 0,
        totalBytes: 0,
        transferredBytes: 0,
        percentage: 0,
        speedBps: 0,
        remainingSeconds: 0,
        ...partial,
      };
    } else {
      this.activeTransfer = { ...this.activeTransfer, ...partial };
    }

    if (this.onProgressCallback) {
      this.onProgressCallback(this.activeTransfer);
    }
  }
}

