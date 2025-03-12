'use client';

import { useDrag, useDrop } from 'react-dnd';
import { FaFile, FaFilePdf, FaFileWord, FaFileExcel, FaFilePowerpoint, FaFileImage, FaFileAlt } from 'react-icons/fa';
import { Document } from '../types';
import { useKnowledgeBase } from '../page';

// 定义拖拽类型
const ItemTypes = {
  DOCUMENT: 'document',
};

const DocumentCard = ({ documents }: { documents: Document[] }) => {
  // 按分组整理文档
  const groupedDocuments = documents.reduce(
    (acc, doc) => {
      const groupId = doc.groupId || 'default';
      if (!acc[groupId]) {
        acc[groupId] = [];
      }
      acc[groupId].push(doc);
      return acc;
    },
    {} as Record<string, Document[]>
  );

  // 分组名称映射
  const groupNames: Record<string, string> = {
    default: '默认分组',
    important: '重要文档',
  };

  if (documents.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p>没有找到匹配的文档</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {Object.entries(groupedDocuments).map(([groupId, docs]) => (
        <DocumentGroup
          key={groupId}
          groupId={groupId}
          groupName={groupNames[groupId] || `分组 ${groupId}`}
          documents={docs}
        />
      ))}
    </div>
  );
};

// 文档分组组件
const DocumentGroup = ({
  groupId,
  groupName,
  documents,
}: {
  groupId: string;
  groupName: string;
  documents: Document[];
}) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.DOCUMENT,
    drop: (item: { id: string }) => {
      // 这里可以添加文档分组移动的逻辑
      console.log(`将文档 ${item.id} 移动到分组 ${groupId}`);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={`border rounded-lg overflow-hidden ${
        isOver ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
      }`}
    >
      <div className="bg-gray-50 px-4 py-2 border-b">
        <h3 className="text-sm font-medium text-gray-700">{groupName}</h3>
        <p className="text-xs text-gray-500">{documents.length} 个文档</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {documents.map((doc, index) => (
          <DocumentCardItem key={doc.id} document={doc} index={index} />
        ))}
      </div>
    </div>
  );
};

type DocumentCardItemProps = {
  document: Document;
  index: number;
};

// 卡片项组件
const DocumentCardItem = ({ document, index }: DocumentCardItemProps) => {
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
        return <FaFilePdf className="text-red-500 text-xl" />;
      case 'docx':
        return <FaFileWord className="text-blue-500 text-xl" />;
      case 'xlsx':
        return <FaFileExcel className="text-green-500 text-xl" />;
      case 'pptx':
        return <FaFilePowerpoint className="text-orange-500 text-xl" />;
      case 'image':
        return <FaFileImage className="text-purple-500 text-xl" />;
      case 'txt':
        return <FaFileAlt className="text-gray-500 text-xl" />;
      default:
        return <FaFile className="text-gray-400 text-xl" />;
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

  // 格式化文件大小
  const formatFileSize = (sizeInKB: number) => {
    if (sizeInKB < 1024) {
      return `${sizeInKB} KB`;
    } else {
      return `${(sizeInKB / 1024).toFixed(2)} MB`;
    }
  };

  return (
    <div
      ref={drag}
      className={`border rounded overflow-hidden flex ${
        isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'
      } ${isDragging ? 'opacity-50' : 'opacity-100'}`}
    >
      <div className="p-3 flex items-center">
        <input
          type="checkbox"
          className="h-4 w-4 text-blue-600 border-gray-300 rounded"
          checked={isSelected}
          onChange={() => {
            if (isSelected) {
              setSelectedDocuments(prev => prev.filter(id => id !== document.id));
            } else {
              setSelectedDocuments(prev => [...prev, document.id]);
            }
          }}
        />
      </div>
      
      <div className="flex-1 p-3">
        <div className="flex items-center">
          {getDocumentIcon(document.type)}
          <h3 
            className="ml-2 text-sm font-medium text-gray-900 truncate cursor-pointer hover:underline"
            onClick={() => setSelectedDocument(document)}
            title={document.name}
          >
            {document.name}
          </h3>
        </div>
        
        <div className="flex justify-between items-center mt-2">
          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyles(document.status)}`}>
            {document.status === 'processing' ? '处理中' : 
             document.status === 'indexed' ? '已索引' : '索引失败'}
          </span>
          
          <span className="text-xs text-gray-500">
            {formatFileSize(document.size)}
          </span>
        </div>
        
        <div className="mt-2 flex flex-wrap gap-1">
          {document.tags.map(tag => (
            <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;
