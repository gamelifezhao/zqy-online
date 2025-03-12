import { Document, Group } from './types';
import { v4 as uuidv4 } from 'uuid';

// 文档类型对应的图标和颜色
export const documentTypeConfig = {
  pdf: {
    icon: 'file-pdf',
    color: 'text-red-500'
  },
  docx: {
    icon: 'file-word',
    color: 'text-blue-500'
  },
  xlsx: {
    icon: 'file-excel',
    color: 'text-green-500'
  },
  pptx: {
    icon: 'file-powerpoint',
    color: 'text-orange-500'
  },
  image: {
    icon: 'file-image',
    color: 'text-purple-500'
  },
  txt: {
    icon: 'file-alt',
    color: 'text-gray-500'
  },
  other: {
    icon: 'file',
    color: 'text-gray-400'
  }
};

// 固定标签
const commonTags: string[] = ['重要', '归档', '待处理', '已完成', '客户资料'];

// 生成随机标签
const generateRandomTags = (): string[] => {
  const tags: string[] = [];
  const numTags = Math.floor(Math.random() * 3); // 0-2个标签
  
  for (let i = 0; i < numTags; i++) {
    const randomIndex = Math.floor(Math.random() * commonTags.length);
    const tag = commonTags[randomIndex];
    if (!tags.includes(tag)) {
      tags.push(tag);
    }
  }
  
  return tags;
};

// 生成随机文档类型
const generateRandomType = (): Document['type'] => {
  const types: Document['type'][] = ['pdf', 'docx', 'xlsx', 'pptx', 'image', 'txt', 'other'];
  const randomIndex = Math.floor(Math.random() * types.length);
  return types[randomIndex];
};

// 生成随机状态
const generateRandomStatus = (): Document['status'] => {
  const statuses: Document['status'][] = ['processing', 'indexed', 'failed'];
  const weights = [0.2, 0.7, 0.1]; // 20%处理中，70%已索引，10%失败
  
  const random = Math.random();
  let cumulativeWeight = 0;
  
  for (let i = 0; i < statuses.length; i++) {
    cumulativeWeight += weights[i];
    if (random < cumulativeWeight) {
      return statuses[i];
    }
  }
  
  return 'indexed'; // 默认返回已索引
};

// 生成随机文档
const generateRandomDocument = (index: number): Document => {
  const type = generateRandomType();
  const status = generateRandomStatus();
  const now = new Date();
  const pastDate = new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000); // 过去30天内的随机时间
  
  return {
    id: uuidv4(),
    name: `文档${index + 1}_${type}.${type}`,
    type,
    size: Math.floor(Math.random() * 10000), // 0-10000KB
    uploadDate: pastDate.toISOString(),
    status,
    tags: generateRandomTags(),
    groupId: Math.random() > 0.7 ? 'important' : 'default',
    description: `这是一个${type}类型的示例文档，用于演示知识库管理功能。`,
    usageStats: {
      searchCount: Math.floor(Math.random() * 100),
      hitRate: Math.round(Math.random() * 100) / 100, // 生成0-1之间的随机数作为命中率，保留两位小数
    }
  };
};

// 生成多个随机文档
export const generateRandomDocuments = (count: number): Document[] => {
  return Array.from({ length: count }, (_, i) => generateRandomDocument(i));
};

// 初始化一些示例文档
export const mockDocuments: Document[] = generateRandomDocuments(40);

// 分组
export const mockGroups: Group[] = [
  {
    id: 'default',
    name: '默认分组',
    count: mockDocuments.filter(doc => doc.groupId === 'default').length
  },
  {
    id: 'important',
    name: '重要文档',
    count: mockDocuments.filter(doc => doc.groupId === 'important').length
  }
];
