'use client';

import { useCallback, useRef, useEffect } from 'react';
import { useDrag, useDrop, DropTargetMonitor } from 'react-dnd';
import { FaFile, FaFilePdf, FaFileWord, FaFileExcel, FaFilePowerpoint, FaFileImage, FaFileAlt } from 'react-icons/fa';
import { Document } from '../types';
import { useKnowledgeBase } from '../page';

// 定义拖拽项结构
interface DragItem {
  id: string;
  index: number;
  type: string;
}

type DocumentItemProps = {
  document: Document;
  index: number;
  moveDocument?: (dragIndex: number, hoverIndex: number) => void;
};

// 定义拖拽类型
const ItemTypes = {
  DOCUMENT: 'document',
};

const DocumentList = ({ documents, onPreview }: { 
  documents: Document[];
  onPreview?: (doc: Document) => void; 
}) => {
  const { selectedDocuments, setSelectedDocuments, setSelectedDocument } = useKnowledgeBase();

  // 处理文档选择
  const handleSelect = (docId: string) => {
    setSelectedDocuments(prev => {
      if (prev.includes(docId)) {
        return prev.filter(id => id !== docId);
      } else {
        return [...prev, docId];
      }
    });
  };

  // 处理文档预览
  const handlePreview = (doc: Document) => {
    setSelectedDocument(doc);
    // 如果提供了外部预览处理函数，也调用它
    if (onPreview) {
      onPreview(doc);
    }
  };

  // 处理文档排序
  const moveDocument = useCallback((dragIndex: number, hoverIndex: number) => {
    // 这里我们不直接修改documents数组，因为它可能是从父组件传递下来的
    // 相反，我们可以记录拖拽状态并在UI中展示排序效果
    console.log(`Moving document from index ${dragIndex} to ${hoverIndex}`);
    // 如果需要永久更改顺序，这里可以调用上下文中的方法更新文档数组
  }, []);

  if (documents.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p>没有找到匹配的文档</p>
      </div>
    );
  }

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg bg-white">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 table-fixed">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="p-4 w-[50px]">
              <input
                type="checkbox"
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                checked={selectedDocuments.length === documents.length && documents.length > 0}
                onChange={() => {
                  if (selectedDocuments.length === documents.length) {
                    setSelectedDocuments([]);
                  } else {
                    setSelectedDocuments(documents.map(doc => doc.id));
                  }
                }}
              />
            </th>
            <th scope="col" className="px-6 py-3 w-[25%]">文档名称</th>
            <th scope="col" className="px-6 py-3 w-[10%]">类型</th>
            <th scope="col" className="px-6 py-3 w-[10%]">大小</th>
            <th scope="col" className="px-6 py-3 w-[15%]">上传日期</th>
            <th scope="col" className="px-6 py-3 w-[10%]">状态</th>
            <th scope="col" className="px-6 py-3 w-[10%]">检索次数</th>
            <th scope="col" className="px-6 py-3 w-[10%]">操作</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {documents.map((doc, index) => (
            <DocumentItem 
              key={doc.id} 
              document={doc} 
              index={index}
              moveDocument={moveDocument}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

// 文档列表项组件
const DocumentItem = ({ document, index, moveDocument }: DocumentItemProps) => {
  const { selectedDocuments, setSelectedDocuments, setSelectedDocument } = useKnowledgeBase();
  const isSelected = selectedDocuments.includes(document.id);
  const rowRef = useRef<HTMLTableRowElement>(null);

  // 定义拖拽源
  const [{ isDragging }, dragRef] = useDrag({
    type: ItemTypes.DOCUMENT,
    item: { id: document.id, index, type: ItemTypes.DOCUMENT } as DragItem,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  // 定义放置目标
  const [dropProps, dropRef] = useDrop({
    accept: ItemTypes.DOCUMENT,
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
    hover: (item: DragItem, monitor: DropTargetMonitor) => {
      if (!rowRef.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // 不替换自己
      if (dragIndex === hoverIndex) {
        return;
      }

      // 确定鼠标位置
      const hoverBoundingRect = rowRef.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset ? clientOffset.y - hoverBoundingRect.top : 0;

      // 仅在鼠标超过一半高度时执行移动
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // 执行移动
      if (moveDocument) {
        moveDocument(dragIndex, hoverIndex);
      }
      
      // 更新拖拽项的索引
      item.index = hoverIndex;
    },
  });

  // 使用一个函数来处理ref的合并
  const attachRef = useCallback(
    (element: HTMLTableRowElement | null) => {
      // 先应用dragRef
      const dragEl = dragRef(element);
      // 然后应用dropRef
      dropRef(dragEl);
      // 不需要手动设置rowRef.current，React会自动处理这个
    },
    [dragRef, dropRef]
  );

  // 获取文档图标
  const getDocumentIcon = (type: Document['type']) => {
    switch (type) {
      case 'pdf':
        return <FaFilePdf className="text-red-500" />;
      case 'docx':
        return <FaFileWord className="text-blue-500" />;
      case 'xlsx':
        return <FaFileExcel className="text-green-500" />;
      case 'pptx':
        return <FaFilePowerpoint className="text-orange-500" />;
      case 'image':
        return <FaFileImage className="text-purple-500" />;
      case 'txt':
        return <FaFileAlt className="text-gray-500" />;
      default:
        return <FaFile className="text-gray-400" />;
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

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <tr 
      ref={attachRef}
      className={`${isDragging ? 'opacity-50' : 'opacity-100'} ${isSelected ? 'bg-blue-50' : ''} cursor-move ${dropProps.isOver ? 'bg-gray-100' : ''}`}
    >
      <td className="p-4 w-[50px]">
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
      </td>
      <td className="px-6 py-3 w-[25%]">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center">
            {getDocumentIcon(document.type)}
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{document.name}</div>
            <div className="text-sm text-gray-500">
              {document.tags.map(tag => (
                <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 mr-1">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-3 w-[10%] text-sm text-gray-500">
        {document.type.toUpperCase()}
      </td>
      <td className="px-6 py-3 w-[10%] text-sm text-gray-500">
        {formatFileSize(document.size)}
      </td>
      <td className="px-6 py-3 w-[15%] text-sm text-gray-500">
        {formatDate(document.uploadDate)}
      </td>
      <td className="px-6 py-3 w-[10%]">
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyles(document.status)}`}>
          {document.status === 'processing' ? '处理中' : 
           document.status === 'indexed' ? '已索引' : '索引失败'}
        </span>
      </td>
      <td className="px-6 py-3 w-[10%] text-sm text-gray-500">
        {document.usageStats.searchCount} 次 <span className="text-xs text-gray-400">(命中率: {document.usageStats.hitRate})</span>
      </td>
      <td className="px-6 py-3 w-[10%] text-sm font-medium">
        <button
          onClick={() => setSelectedDocument(document)}
          className="text-blue-600 hover:text-blue-900 mr-3"
        >
          预览
        </button>
        <button
          className="text-red-600 hover:text-red-900"
        >
          删除
        </button>
      </td>
    </tr>
  );
};

export default DocumentList;
