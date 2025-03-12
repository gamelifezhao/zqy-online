// 文档类型定义
export type Document = {
  id: string;
  name: string;
  type: 'pdf' | 'docx' | 'xlsx' | 'pptx' | 'image' | 'txt' | 'other';
  size: number; // 以KB为单位
  uploadDate: string;
  status: 'processing' | 'indexed' | 'failed';
  groupId: string;
  tags: string[];
  description?: string; // 文档描述
  previewUrl?: string;
  usageStats: {
    searchCount: number;
    hitRate: number;
  };
};

// 视图模式
export type ViewMode = 'list' | 'grid' | 'card';

// 筛选选项
export type FilterOptions = {
  types: Array<Document['type']>;
  status: Array<Document['status']>;
  date: Date | null;
  sizeRange: {
    min: number | null; // 以KB为单位
    max: number | null; // 以KB为单位
  };
};

// 分组类型
export type Group = {
  id: string;
  name: string;
  count: number;  // 组内文档数量
};

// 文档预览支持的类型
export type PreviewType = 'pdf' | 'image' | 'text' | 'office' | 'unsupported';
