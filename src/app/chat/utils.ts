// 日期格式化
export function formatTimestamp(timestamp: number | string): string {
  const date = typeof timestamp === 'number' ? new Date(timestamp) : new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  // 今天的消息显示时间
  if (diffDays === 0) {
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  }
  // 昨天的消息
  else if (diffDays === 1) {
    return `昨天 ${date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}`;
  }
  // 一周内的消息显示星期几
  else if (diffDays < 7) {
    const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
    return `星期${weekdays[date.getDay()]} ${date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}`;
  }
  // 更早的消息显示完整日期
  else {
    return date.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }) + 
           ' ' + date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  }
}

// 文件大小格式化
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return bytes + ' B';
  } else if (bytes < 1024 * 1024) {
    return (bytes / 1024).toFixed(1) + ' KB';
  } else if (bytes < 1024 * 1024 * 1024) {
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  } else {
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
  }
}

// 生成唯一ID
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

// 限制文本长度
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

// 检测代码语言
export function detectCodeLanguage(code: any): string {
  // 简单检测逻辑，实际应用中可能需要更复杂的算法
  if (code.includes('function') || code.includes('const ') || code.includes('var ') || code.includes('let ')) {
    return 'javascript';
  } else if (code.includes('def ') || code.includes('import ') || (code.includes('class ') && code.includes(':'))) {
    return 'python';
  } else if (code.includes('SELECT ') || code.includes('FROM ') || code.includes('WHERE ')) {
    return 'sql';
  } else if (code.includes('<html') || code.includes('</div>')) {
    return 'html';
  } else if (code.includes('{') && code.includes('}')) {
    return 'json';
  }
  return 'plaintext';
}

// 从文件MIME类型判断文件类型
export function getFileTypeFromMime(mimeType: string): 'image' | 'audio' | 'video' | 'file' {
  if (mimeType.startsWith('image/')) {
    return 'image';
  } else if (mimeType.startsWith('audio/')) {
    return 'audio';
  } else if (mimeType.startsWith('video/')) {
    return 'video';
  } else {
    return 'file';
  }
}

// 从文件扩展名获取图标
export function getFileIcon(filename: string): string {
  const extension = filename.split('.').pop()?.toLowerCase() || '';
  
  // 根据文件扩展名返回图标名称或路径
  switch (extension) {
    case 'pdf':
      return 'file-pdf-outline';
    case 'doc':
    case 'docx':
      return 'file-word-outline';
    case 'xls':
    case 'xlsx':
      return 'file-excel-outline';
    case 'ppt':
    case 'pptx':
      return 'file-powerpoint-outline';
    case 'zip':
    case 'rar':
    case '7z':
      return 'file-zip-outline';
    case 'txt':
      return 'file-text-outline';
    case 'mp3':
    case 'wav':
    case 'ogg':
      return 'file-music-outline';
    case 'mp4':
    case 'avi':
    case 'mov':
      return 'file-video-outline';
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
      return 'file-image-outline';
    default:
      return 'file-outline';
  }
}
