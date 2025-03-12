// 聊天会话类型
export interface ChatSession {
  id: string;
  title: string;
  name?: string; // 会话名称（可选，与title可能重复）
  createdAt: number;
  updatedAt: number;
  messages: string[]; // 消息ID列表
  pinned?: boolean;
  archived?: boolean;
  category?: string;
  tags?: string[];
  scenario?: 'general' | 'customer-service' | 'dashboard' | 'doc-generation' | 'data-pipeline'; // 应用场景
  lastMessage?: string; // 最后一条消息预览
  unreadCount?: number; // 未读消息数
}

// 内容类型
export type ContentType = 'text' | 'image' | 'audio' | 'video' | 'file' | 'code' | 'chart' | 'table' | 'voice';

// 文件类型
export type FileType = 'image' | 'audio' | 'video' | 'file' | 'text' | 'code' | 'pdf' | 'archive' | 'spreadsheet';

// 附件类型
export interface Attachment {
  id: string;
  name: string;
  type: FileType;
  url: string;
  size: number;
  mimeType: string;
  createdAt: number;
  contentPreview?: string | object; // 文件内容预览
  format?: string; // 文件格式，如代码语言类型
  preview?: string; // 文件的本地预览URL
  metadata?: {
    width?: number;
    height?: number;
    duration?: number;
    pages?: number;
    [key: string]: any;
  };
}

// 结构化数据类型
export interface StructuredData {
  type: 'table' | 'chart' | 'list';
  title?: string;
  description?: string;
  data: any;
  columns?: {
    key: string;
    title: string;
    dataType?: 'string' | 'number' | 'date' | 'boolean';
  }[];
  chartType?: 'bar' | 'line' | 'pie' | 'scatter' | 'area';
  [key: string]: any;
}

// 聊天消息类型
export interface ChatMessage {
  id: string;
  sessionId: string;
  sender: 'user' | 'assistant' | 'system';
  timestamp: number;
  content: string | {
    text?: string;
    url?: string;
    duration?: number;
    [key: string]: any;
  };
  contentType: ContentType;
  status?: 'sending' | 'sent' | 'failed' | 'seen';
  attachments?: Attachment[];
  metadata?: {
    [key: string]: any;
  };
  replyTo?: string; // 回复的消息ID
  replyToContent?: string; // 回复的消息内容预览
  structuredData?: StructuredData; // 结构化数据
}

// 图片裁剪类型
export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

// 图片编辑状态
export interface ImageEditState {
  crop: CropArea | null;
  rotation: number;
  scale: number;
  filter: string;
}

// 代码编辑器支持的语言
export type CodeLanguage = 'javascript' | 'typescript' | 'python' | 'java' | 'c' | 
  'cpp' | 'csharp' | 'go' | 'ruby' | 'php' | 'swift' | 'kotlin' | 'rust' | 
  'html' | 'css' | 'json' | 'xml' | 'markdown' | 'sql' | 'bash' | 'powershell' | 
  'yaml' | 'dockerfile' | 'plaintext';

// 图表类型
export type ChartType = 'bar' | 'line' | 'pie' | 'scatter' | 'radar' | 'heatmap';

// 语音输入状态
export interface VoiceInputState {
  isRecording: boolean;
  transcript: string;
  error: string | null;
}

// 多模态输入状态
export interface MultiModalInputState {
  text: string;
  attachments: Attachment[];
  inputMode: 'text' | 'voice' | 'image' | 'file';
  isEditing: boolean;
  editingAttachmentId: string | null;
}
