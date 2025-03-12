'use client';

import { useState, useEffect, useContext, createContext } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { IoGridOutline, IoListOutline, IoCardOutline, IoAddOutline, IoFilterOutline, IoStatsChartOutline } from 'react-icons/io5';
import DocumentList from './components/DocumentList';
import DocumentGrid from './components/DocumentGrid';
import DocumentCard from './components/DocumentCard';
import SearchBar from './components/SearchBar';
import FilterPanel from './components/FilterPanel';
import StatisticsPanel from './components/StatisticsPanel';
import BatchOperationsPanel from './components/BatchOperationsPanel';
import DocPreview from './components/DocPreview';
import FileUploader from './components/FileUploader';
import { Document, ViewMode, FilterOptions } from './types';
import { mockDocuments, generateRandomDocuments } from './mockData';

// 创建知识库文档上下文
type KnowledgeBaseContextType = {
  documents: Document[];
  setDocuments: React.Dispatch<React.SetStateAction<Document[]>>;
  selectedDocuments: string[];
  setSelectedDocuments: React.Dispatch<React.SetStateAction<string[]>>;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  filterOptions: FilterOptions;
  setFilterOptions: React.Dispatch<React.SetStateAction<FilterOptions>>;
  viewMode: ViewMode;
  setViewMode: React.Dispatch<React.SetStateAction<ViewMode>>;
  selectedDocument: Document | null;
  setSelectedDocument: React.Dispatch<React.SetStateAction<Document | null>>;
};

const KnowledgeBaseContext = createContext<KnowledgeBaseContextType | undefined>(undefined);

export const useKnowledgeBase = () => {
  const context = useContext(KnowledgeBaseContext);
  if (!context) {
    throw new Error('useKnowledgeBase must be used within a KnowledgeBaseProvider');
  }
  return context;
};

export default function KnowledgeBasePage() {
  // 状态管理
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    types: [],
    status: [],
    date: null,
    sizeRange: { min: null, max: null },
  });
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [showStatsPanel, setShowStatsPanel] = useState(false);
  const [showUploader, setShowUploader] = useState(false);

  // 模拟实时更新文档状态
  useEffect(() => {
    const websocket = {
      // 真实环境中这里将连接到实际的WebSocket服务器
      connect: () => {
        console.log('WebSocket连接已建立');
        // 模拟接收文档更新
        const intervalId = setInterval(() => {
          setDocuments(prevDocs => {
            // 随机更新一个文档的状态
            if (prevDocs.length === 0) return prevDocs;
            const randomIndex = Math.floor(Math.random() * prevDocs.length);
            const newDocs = [...prevDocs];
            const statusOptions = ['processing', 'indexed', 'failed'];
            const newStatus = statusOptions[Math.floor(Math.random() * statusOptions.length)];
            
            newDocs[randomIndex] = {
              ...newDocs[randomIndex],
              status: newStatus as 'processing' | 'indexed' | 'failed'
            };
            return newDocs;
          });
        }, 10000); // 每10秒模拟一次更新
        
        return () => clearInterval(intervalId);
      }
    };
    
    const cleanup = websocket.connect();
    return cleanup;
  }, []);

  // 模拟每隔一段时间添加新文档
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newDocs = generateRandomDocuments(1);
        setDocuments(prevDocs => [...prevDocs, ...newDocs]);
      }
    }, 30000); // 每30秒有30%的概率添加新文档
    
    return () => clearInterval(interval);
  }, []);

  // 过滤文档列表
  const filteredDocuments = documents
    // 筛选类型
    .filter(doc => filterOptions.types.length === 0 || filterOptions.types.includes(doc.type))
    // 筛选状态
    .filter(doc => filterOptions.status.length === 0 || filterOptions.status.includes(doc.status))
    // 筛选日期
    .filter(doc => {
      if (!filterOptions.date) return true;
      
      const docDate = new Date(doc.uploadDate);
      const filterDate = new Date(filterOptions.date);
      
      // 比较年月日，忽略时间
      return docDate.getFullYear() === filterDate.getFullYear() &&
             docDate.getMonth() === filterDate.getMonth() &&
             docDate.getDate() === filterDate.getDate();
    })
    // 筛选大小
    .filter(doc => {
      if (filterOptions.sizeRange.min !== null && doc.size < filterOptions.sizeRange.min) {
        return false;
      }
      
      if (filterOptions.sizeRange.max !== null && doc.size > filterOptions.sizeRange.max) {
        return false;
      }
      
      return true;
    })
    // 搜索查询过滤
    .filter(doc => {
      if (searchQuery && !doc.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      return true;
    });

  // 批量操作函数
  const handleBulkAction = (action: 'move' | 'delete' | 'tag', groupId?: string, tag?: string) => {
    if (selectedDocuments.length === 0) return;
    
    switch (action) {
      case 'move':
        if (!groupId) return;
        setDocuments(prevDocs => {
          return prevDocs.map(doc => {
            if (selectedDocuments.includes(doc.id)) {
              return { ...doc, groupId };
            }
            return doc;
          });
        });
        break;
      case 'delete':
        setDocuments(prevDocs => {
          return prevDocs.filter(doc => !selectedDocuments.includes(doc.id));
        });
        break;
      case 'tag':
        if (!tag) return;
        setDocuments(prevDocs => {
          return prevDocs.map(doc => {
            if (selectedDocuments.includes(doc.id)) {
              return { ...doc, tags: [...doc.tags, tag] };
            }
            return doc;
          });
        });
        break;
    }
    
    // 清除选择
    setSelectedDocuments([]);
  };

  // 处理添加文档
  const handleAddDocument = () => {
    setShowUploader(true);
  };

  // 处理上传完成
  const handleUploadComplete = (newDocs: Document[]) => {
    setDocuments(prevDocs => [...prevDocs, ...newDocs]);
    
    // 模拟文档处理过程
    newDocs.forEach(doc => {
      // 模拟延迟处理
      setTimeout(() => {
        setDocuments(prevDocs => 
          prevDocs.map(d => 
            d.id === doc.id 
              ? { ...d, status: 'indexed' as const } 
              : d
          )
        );
      }, 5000 + Math.random() * 10000); // 随机5-15秒完成处理
    });
  };

  // 预览文档
  const handlePreviewDocument = (doc: Document) => {
    setSelectedDocument(doc);
  };

  // 视图切换按钮渲染
  const renderViewToggle = () => (
    <div className="flex items-center space-x-2 p-2 bg-gray-100 rounded-lg">
      <button
        className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow' : ''}`}
        onClick={() => setViewMode('list')}
        aria-label="列表视图"
      >
        <IoListOutline size={20} />
      </button>
      <button
        className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow' : ''}`}
        onClick={() => setViewMode('grid')}
        aria-label="网格视图"
      >
        <IoGridOutline size={20} />
      </button>
      <button
        className={`p-2 rounded ${viewMode === 'card' ? 'bg-white shadow' : ''}`}
        onClick={() => setViewMode('card')}
        aria-label="卡片视图"
      >
        <IoCardOutline size={20} />
      </button>
    </div>
  );

  // 批量操作按钮渲染
  const renderBulkActions = () => (
    <div className={`flex items-center space-x-2 ${selectedDocuments.length > 0 ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
      <button 
        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
        onClick={() => handleBulkAction('move', 'default')}
        disabled={selectedDocuments.length === 0}
      >
        移动到默认组
      </button>
      <button 
        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-300"
        onClick={() => handleBulkAction('delete')}
        disabled={selectedDocuments.length === 0}
      >
        删除所选
      </button>
      <button 
        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-300"
        onClick={() => handleBulkAction('tag', undefined, 'important')}
        disabled={selectedDocuments.length === 0}
      >
        标记为重要
      </button>
    </div>
  );

  // 渲染当前视图
  const renderCurrentView = () => {
    switch (viewMode) {
      case 'grid':
        return <DocumentGrid documents={filteredDocuments} />;
      case 'card':
        return <DocumentCard documents={filteredDocuments} />;
      case 'list':
      default:
        return <DocumentList documents={filteredDocuments} />;
    }
  };

  return (
    <KnowledgeBaseContext.Provider
      value={{
        documents,
        setDocuments,
        selectedDocuments,
        setSelectedDocuments,
        searchQuery,
        setSearchQuery,
        filterOptions,
        setFilterOptions,
        viewMode,
        setViewMode,
        selectedDocument,
        setSelectedDocument,
      }}
    >
      <DndProvider backend={HTML5Backend}>
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">知识库文档管理</h1>
          </div>
          
          <div className="grid grid-cols-12 gap-6">
            {/* 左侧面板 - 现在始终显示 */}
            <div className="col-span-12 md:col-span-3 space-y-4">
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">高级筛选</h3>
                  <button
                    className="flex items-center px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                    onClick={handleAddDocument}
                  >
                    <IoAddOutline className="mr-1" />
                    <span>添加文档</span>
                  </button>
                </div>
                <FilterPanel />
              </div>
              
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="text-lg font-medium mb-4">文档统计</h3>
                <StatisticsPanel />
              </div>
              
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="text-lg font-medium mb-4">批量操作</h3>
                <BatchOperationsPanel />
              </div>
            </div>
            
            {/* 主要内容区域 */}
            <div className="col-span-12 md:col-span-9">
              <div className="mb-4">
                <SearchBar />
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow mb-4">
                <div className="flex flex-wrap justify-between items-center">
                  <div className="flex items-center mb-2 md:mb-0">
                    <span className="text-sm text-gray-500 mr-4">
                      {filteredDocuments.length} 个文档
                      {selectedDocuments.length > 0 && ` (已选择 ${selectedDocuments.length} 个)`}
                    </span>
                    {selectedDocuments.length > 0 && (
                      <button
                        onClick={() => setSelectedDocuments([])}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        取消选择
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap space-x-2">
                    {renderViewToggle()}
                    {renderBulkActions()}
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow">
                {renderCurrentView()}
              </div>
            </div>
          </div>
          
          {/* 文档预览弹窗 */}
          {selectedDocument && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <DocPreview
                document={selectedDocument}
                onClose={() => setSelectedDocument(null)}
              />
            </div>
          )}
          
          {/* 文件上传器 */}
          <FileUploader
            visible={showUploader}
            onClose={() => setShowUploader(false)}
            onUploadComplete={handleUploadComplete}
          />
        </div>
      </DndProvider>
    </KnowledgeBaseContext.Provider>
  );
}
