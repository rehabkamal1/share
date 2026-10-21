/**
 * CloudShare Utility Functions
 */

export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 بايت';
  if (bytes < 0) return '0 بايت';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['بايت', 'ك.بايت', 'م.بايت', 'ج.بايت', 'ت.بايت'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const safeIndex = Math.min(i, sizes.length - 1);
  const value = parseFloat((bytes / Math.pow(k, safeIndex)).toFixed(dm));

  return `${value} ${sizes[safeIndex]}`;
}

export function formatSpeed(bytesPerSecond: number): string {
  if (bytesPerSecond <= 0) return '0 ك.بايت/ث';
  return `${formatBytes(bytesPerSecond)}/ث`;
}

export function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0 || !isFinite(seconds)) return 'ثوانٍ قليلة';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);

  if (mins === 0) {
    return `${secs} ثانية`;
  }
  if (mins < 60) {
    return `${mins} دقيقة و ${secs} ث`;
  }
  const hours = Math.floor(mins / 60);
  const remMins = mins % 60;
  return `${hours} ساعة و ${remMins} د`;
}

export function sanitizeFilename(filename: string): string {
  // Prevent path traversal and unsafe characters while preserving Arabic letters and standard unicode
  return filename
    .replace(/[/\\]/g, '_')
    .replace(/\.\./g, '_')
    .replace(/[\x00-\x1f\x80-\x9f]/g, '')
    .trim() || 'file';
}

export function generatePinCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function generateSessionId(): string {
  return 'sf_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
}

export function getFileCategory(mimeType: string, filename: string): 'image' | 'video' | 'audio' | 'document' | 'other' {
  const mime = mimeType.toLowerCase();
  const ext = filename.split('.').pop()?.toLowerCase() || '';

  if (mime.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif', 'webp', 'heic', 'svg'].includes(ext)) {
    return 'image';
  }
  if (mime.startsWith('video/') || ['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(ext)) {
    return 'video';
  }
  if (mime.startsWith('audio/') || ['mp3', 'wav', 'ogg', 'm4a', 'aac', 'flac'].includes(ext)) {
    return 'audio';
  }
  if (
    mime.includes('pdf') ||
    mime.includes('word') ||
    mime.includes('excel') ||
    mime.includes('presentation') ||
    mime.includes('text') ||
    ['pdf', 'docx', 'doc', 'xlsx', 'xls', 'pptx', 'txt', 'csv', 'zip', 'rar'].includes(ext)
  ) {
    return 'document';
  }
  return 'other';
}

