'use client';

import { FaFile, FaFilePdf, FaFileWord, FaFileExcel, FaFilePowerpoint, FaFileImage, FaFileAlt } from 'react-icons/fa';
import { useDrag } from 'react-dnd';
import { Document } from '../types';
import { useKnowledgeBase } from '../page';

// 定义拖拽类型
const ItemTypes = {
  DOCUMENT: 'document',
};

const DocumentGrid = ({ documents }: { documents: Document[] }) => {
  if (documents.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p>没有找到匹配的文档</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {documents.map((doc, index) => (
        <DocumentGridItem key={doc.id} document={doc} index={index} />
      ))}
    </div>
  );
};

type DocumentGridItemProps = {
  document: Document;
  index: number;
};

// 文档网格项组件
const DocumentGridItem = ({ document, index }: DocumentGridItemProps) => {
  const { selectedDocuments, setSelectedDocuments, setSelectedDocument } = useKnowledgeBase();
  const isSelected = selectedDocuments.includes(document.id);

  // 定义拖拽源
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.DOCUMENT,
    item: { id: document.id, index },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  // 获取文档图标
  const getDocumentIcon = (type: Document['type']) => {
    switch (type) {
      case 'pdf':
        return <FaFilePdf className="text-red-500 text-4xl" />;
      case 'docx':
        return <FaFileWord className="text-blue-500 text-4xl" />;
      case 'xlsx':
        return <FaFileExcel className="text-green-500 text-4xl" />;
      case 'pptx':
        return <FaFilePowerpoint className="text-orange-500 text-4xl" />;
      case 'image':
        return <FaFileImage className="text-purple-500 text-4xl" />;
      case 'txt':
        return <FaFileAlt className="text-gray-500 text-4xl" />;
      default:
        return <FaFile className="text-gray-400 text-4xl" />;
    }
  };

  // 格式化文件大小
  const formatFileSize = (sizeInKB: number) => {
    if (sizeInKB < 1024) {
      return `${sizeInKB} KB`;
    } else {
      return `${(sizeInKB / 1024).toFixed(2)} MB`;
    }
  };

  // 获取状态标签样式
  const getStatusStyles = (status: Document['status']) => {
    switch (status) {
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'indexed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div
      ref={drag}
      className={`border rounded-lg overflow-hidden ${
        isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
      } ${isDragging ? 'opacity-50' : 'opacity-100'} hover:shadow-md transition-shadow duration-200`}
    >
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              type="checkbox"
              className="h-4 w-4 text-blue-600 border-gray-300 rounded mr-2"
              checked={isSelected}
              onChange={() => {
                if (isSelected) {
                  setSelectedDocuments(prev => prev.filter(id => id !== document.id));
                } else {
                  setSelectedDocuments(prev => [...prev, document.id]);
                }
              }}
            />
            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyles(document.status)}`}>
              {document.status === 'processing' ? '处理中' : 
               document.status === 'indexed' ? '已索引' : '索引失败'}
            </span>
          </div>
          <div className="text-xs text-gray-500">
            {formatFileSize(document.size)}
          </div>
        </div>

        <div className="flex justify-center my-4" onClick={() => setSelectedDocument(document)}>
          {getDocumentIcon(document.type)}
        </div>

        <div className="mt-2">
          <h3 className="text-sm font-medium text-gray-900 truncate" title={document.name}>
            {document.name}
          </h3>
          <div className="flex flex-wrap mt-1 space-x-1">
            {document.tags.map(tag => (
              <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 mb-1">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-2 text-xs text-gray-500 flex justify-between">
          <span>检索: {document.usageStats.searchCount}次</span>
          <span>命中率: {document.usageStats.hitRate}</span>
        </div>

        <div className="mt-3 flex justify-between">
          <button
            onClick={() => setSelectedDocument(document)}
            className="text-xs text-blue-600 hover:text-blue-800"
          >
            预览
          </button>
          <button
            className="text-xs text-red-600 hover:text-red-800"
          >
            删除
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentGrid;
