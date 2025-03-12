'use client';

import { useState } from 'react';
import { FaUsers, FaChartLine, FaFileAlt, FaDatabase, FaCaretDown, FaCaretUp, FaFolder, FaTag, FaTrash } from 'react-icons/fa';
import { useKnowledgeBase } from '../page';

const BatchOperationsPanel = () => {
  const { documents, selectedDocuments, setDocuments, setSelectedDocuments } = useKnowledgeBase();
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState<'basic' | 'scenarios'>('basic');

  // 基本批量操作 - 移动到分组
  const moveToGroup = (groupId: string) => {
    if (selectedDocuments.length === 0) return;
    
    setDocuments(prevDocs => {
      return prevDocs.map(doc => {
        if (selectedDocuments.includes(doc.id)) {
          return { ...doc, groupId };
        }
        return doc;
      });
    });
    
    // 操作后清除选择
    setSelectedDocuments([]);
  };

  // 基本批量操作 - 添加标签
  const addTag = (tag: string) => {
    if (selectedDocuments.length === 0) return;
    
    setDocuments(prevDocs => {
      return prevDocs.map(doc => {
        if (selectedDocuments.includes(doc.id)) {
          if (!doc.tags.includes(tag)) {
            return { ...doc, tags: [...doc.tags, tag] };
          }
        }
        return doc;
      });
    });
  };

  // 基本批量操作 - 删除文档
  const deleteDocuments = () => {
    if (selectedDocuments.length === 0 || !window.confirm(`确定要删除选中的 ${selectedDocuments.length} 个文档吗？`)) return;
    
    setDocuments(prevDocs => {
      return prevDocs.filter(doc => !selectedDocuments.includes(doc.id));
    });
    
    // 操作后清除选择
    setSelectedDocuments([]);
  };

  // 应用场景相关批量操作 - 智能客服系统
  const prepareForCustomerService = () => {
    if (selectedDocuments.length === 0) return;
    
    setDocuments(prevDocs => {
      return prevDocs.map(doc => {
        if (selectedDocuments.includes(doc.id)) {
          // 设置为已索引状态，添加智能客服系统标签
          const updatedTags = Array.from(new Set([...doc.tags, '智能客服']));
          return { 
            ...doc, 
            status: 'indexed', 
            tags: updatedTags
          };
        }
        return doc;
      });
    });
    
    // 操作后清除选择
    setSelectedDocuments([]);
  };

  // 应用场景相关批量操作 - 动态数据仪表板
  const prepareForDashboard = () => {
    if (selectedDocuments.length === 0) return;
    
    setDocuments(prevDocs => {
      return prevDocs.map(doc => {
        if (selectedDocuments.includes(doc.id)) {
          // 设置为已索引状态，添加数据仪表板标签
          const updatedTags = Array.from(new Set([...doc.tags, '数据仪表板']));
          return { 
            ...doc, 
            status: 'indexed', 
            tags: updatedTags
          };
        }
        return doc;
      });
    });
    
    // 操作后清除选择
    setSelectedDocuments([]);
  };

  // 应用场景相关批量操作 - 自动化文档生成
  const prepareForDocGeneration = () => {
    if (selectedDocuments.length === 0) return;
    
    setDocuments(prevDocs => {
      return prevDocs.map(doc => {
        if (selectedDocuments.includes(doc.id)) {
          // 添加文档生成标签
          const updatedTags = Array.from(new Set([...doc.tags, '文档生成']));
          return { 
            ...doc, 
            tags: updatedTags
          };
        }
        return doc;
      });
    });
    
    // 操作后清除选择
    setSelectedDocuments([]);
  };

  // 应用场景相关批量操作 - 实时数据分析管道
  const prepareForDataPipeline = () => {
    if (selectedDocuments.length === 0) return;
    
    setDocuments(prevDocs => {
      return prevDocs.map(doc => {
        if (selectedDocuments.includes(doc.id)) {
          // 添加数据分析标签
          const updatedTags = Array.from(new Set([...doc.tags, '数据分析']));
          return { 
            ...doc, 
            tags: updatedTags
          };
        }
        return doc;
      });
    });
    
    // 操作后清除选择
    setSelectedDocuments([]);
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div 
        className="bg-gray-50 px-4 py-3 flex justify-between items-center cursor-pointer border-b"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <FaFolder className="text-gray-500 mr-2" />
          <h3 className="text-sm font-medium text-gray-700">批量操作</h3>
          <span className="ml-2 text-xs text-gray-500">
            {selectedDocuments.length > 0 
              ? `已选择 ${selectedDocuments.length} 个文档`
              : '请先选择文档'}
          </span>
        </div>
        {isExpanded ? <FaCaretUp className="text-gray-500" /> : <FaCaretDown className="text-gray-500" />}
      </div>
      
      {isExpanded && (
        <div className="p-4">
          {/* 选项卡 */}
          <div className="flex border-b mb-4">
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'basic' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('basic')}
            >
              基本操作
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'scenarios' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('scenarios')}
            >
              应用场景
            </button>
          </div>
          
          {selectedDocuments.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              请先在文档列表中选择文档
            </div>
          ) : activeTab === 'basic' ? (
            <div className="space-y-4">
              {/* 基本操作按钮 */}
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  移动到分组
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    className="px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 
                               bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
                               flex items-center justify-center"
                    onClick={() => moveToGroup('default')}
                  >
                    <FaFolder className="mr-1" />
                    默认分组
                  </button>
                  <button
                    className="px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 
                               bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
                               flex items-center justify-center"
                    onClick={() => moveToGroup('important')}
                  >
                    <FaFolder className="mr-1 text-yellow-500" />
                    重要文档
                  </button>
                </div>
              </div>
              
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  添加标签
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    className="px-2 py-1 border border-gray-300 rounded-md text-xs flex items-center justify-center bg-white hover:bg-gray-50"
                    onClick={() => addTag('重要')}
                  >
                    <FaTag className="mr-1 text-red-500" />
                    重要
                  </button>
                  <button
                    className="px-2 py-1 border border-gray-300 rounded-md text-xs flex items-center justify-center bg-white hover:bg-gray-50"
                    onClick={() => addTag('归档')}
                  >
                    <FaTag className="mr-1 text-blue-500" />
                    归档
                  </button>
                  <button
                    className="px-2 py-1 border border-gray-300 rounded-md text-xs flex items-center justify-center bg-white hover:bg-gray-50"
                    onClick={() => addTag('待处理')}
                  >
                    <FaTag className="mr-1 text-yellow-500" />
                    待处理
                  </button>
                </div>
              </div>
              
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  删除操作
                </h4>
                <button
                  className="w-full px-3 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 
                             bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 
                             flex items-center justify-center"
                  onClick={deleteDocuments}
                >
                  <FaTrash className="mr-1" />
                  删除所选文档
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* 应用场景相关批量操作 */}
              <button
                className="w-full px-3 py-3 border border-blue-300 rounded-md shadow-sm text-sm font-medium text-blue-700 
                           bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
                           flex items-center"
                onClick={prepareForCustomerService}
              >
                <div className="bg-blue-100 rounded-full p-2 mr-3">
                  <FaUsers className="text-blue-500" />
                </div>
                <div className="text-left">
                  <div className="font-medium">智能客服系统</div>
                  <div className="text-xs text-gray-500">
                    标记文档为已索引状态，添加智能客服系统标签
                  </div>
                </div>
              </button>
              
              <button
                className="w-full px-3 py-3 border border-green-300 rounded-md shadow-sm text-sm font-medium text-green-700 
                           bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 
                           flex items-center"
                onClick={prepareForDashboard}
              >
                <div className="bg-green-100 rounded-full p-2 mr-3">
                  <FaChartLine className="text-green-500" />
                </div>
                <div className="text-left">
                  <div className="font-medium">动态数据仪表板</div>
                  <div className="text-xs text-gray-500">
                    标记文档为已索引状态，添加数据仪表板标签
                  </div>
                </div>
              </button>
              
              <button
                className="w-full px-3 py-3 border border-purple-300 rounded-md shadow-sm text-sm font-medium text-purple-700 
                           bg-white hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 
                           flex items-center"
                onClick={prepareForDocGeneration}
              >
                <div className="bg-purple-100 rounded-full p-2 mr-3">
                  <FaFileAlt className="text-purple-500" />
                </div>
                <div className="text-left">
                  <div className="font-medium">自动化文档生成</div>
                  <div className="text-xs text-gray-500">
                    添加文档生成标签，用于自动化文档处理
                  </div>
                </div>
              </button>
              
              <button
                className="w-full px-3 py-3 border border-orange-300 rounded-md shadow-sm text-sm font-medium text-orange-700 
                           bg-white hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 
                           flex items-center"
                onClick={prepareForDataPipeline}
              >
                <div className="bg-orange-100 rounded-full p-2 mr-3">
                  <FaDatabase className="text-orange-500" />
                </div>
                <div className="text-left">
                  <div className="font-medium">实时数据分析管道</div>
                  <div className="text-xs text-gray-500">
                    添加数据分析标签，用于实时数据处理与分析
                  </div>
                </div>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BatchOperationsPanel;
