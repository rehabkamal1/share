/**
 * CloudShare Cloud Link API Client
 */

export interface CreateShareOptions {
  title?: string;
  expiresInMinutes?: number;
  password?: string;
  maxDownloads?: number;
}

export interface ShareMetadataResponse {
  success: boolean;
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
  maxDownloads: number;
}

export class CloudShareApiClient {
  private static baseUrl = 'http://localhost:4000/api';

  static setBaseUrl(url: string) {
    this.baseUrl = url;
  }

  static getBaseUrl(): string {
    return this.baseUrl;
  }

  static async createShare(options: CreateShareOptions): Promise<{ token: string; id: string; expiresAt: number }> {
    const res = await fetch(`${this.baseUrl}/shares`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(options),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'فشل إنشاء الرابط');
    return data;
  }

  static async uploadFiles(
    token: string,
    files: File[],
    onProgress?: (percentage: number) => void
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const formData = new FormData();

      for (const f of files) {
        formData.append('files', f);
      }

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable && onProgress) {
          const pct = Math.round((e.loaded / e.total) * 100);
          onProgress(pct);
        }
      };

      xhr.onload = () => {
        try {
          const res = JSON.parse(xhr.responseText);
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(res);
          } else {
            reject(new Error(res.message || 'فشل رفع الملفات'));
          }
        } catch {
          reject(new Error('خطأ في استجابة الخادم'));
        }
      };

      xhr.onerror = () => reject(new Error('تعذر الاتصال بالخادم، تأكد من تشغيل API'));
      xhr.open('POST', `${this.baseUrl}/shares/${token}/upload`);
      xhr.send(formData);
    });
  }

  static async getShareMetadata(token: string): Promise<ShareMetadataResponse> {
    const res = await fetch(`${this.baseUrl}/shares/${token}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'الرابط غير متاح أو منتهي الصلاحية');
    return data;
  }

  static async authorizeDownload(token: string, password?: string): Promise<string> {
    const res = await fetch(`${this.baseUrl}/shares/${token}/authorize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'كلمة المرور غير صحيحة');
    return data.downloadToken;
  }

  static getDownloadUrl(token: string, auth?: string, fileId?: string): string {
    const query = auth ? `?auth=${encodeURIComponent(auth)}` : '';
    if (fileId) {
      return `${this.baseUrl}/shares/${token}/files/${fileId}${query}`;
    }
    return `${this.baseUrl}/shares/${token}/download${query}`;
  }

  static async deleteShare(token: string): Promise<void> {
    const res = await fetch(`${this.baseUrl}/shares/${token}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'تعذر حذف الرابط');
  }
}

