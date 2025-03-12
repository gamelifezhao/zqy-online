'use client';

import { useState, useEffect } from 'react';
import { FaChartBar, FaCaretDown, FaCaretUp } from 'react-icons/fa';
import { useKnowledgeBase } from '../page';
import { Document } from '../types';

const StatisticsPanel = () => {
  const { documents } = useKnowledgeBase();
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState<'usage' | 'scenarios'>('usage');

  // 计算文档统计数据
  const stats = {
    totalDocuments: documents.length,
    totalSize: documents.reduce((sum, doc) => sum + doc.size, 0),
    byStatus: {
      processing: documents.filter(doc => doc.status === 'processing').length,
      indexed: documents.filter(doc => doc.status === 'indexed').length,
      failed: documents.filter(doc => doc.status === 'failed').length,
    },
    byType: {
      pdf: documents.filter(doc => doc.type === 'pdf').length,
      docx: documents.filter(doc => doc.type === 'docx').length,
      xlsx: documents.filter(doc => doc.type === 'xlsx').length,
      pptx: documents.filter(doc => doc.type === 'pptx').length,
      image: documents.filter(doc => doc.type === 'image').length,
      txt: documents.filter(doc => doc.type === 'txt').length,
      other: documents.filter(doc => doc.type === 'other').length,
    },
    totalSearchCount: documents.reduce((sum, doc) => sum + doc.usageStats.searchCount, 0),
    averageHitRate: documents.length
      ? documents.reduce((sum, doc) => sum + parseFloat(doc.usageStats.hitRate.toString()), 0) / documents.length
      : 0,
  };

  // 应用场景相关统计
  const scenarioStats = {
    // 智能客服系统
    customerService: {
      relevantDocs: documents.filter(doc => 
        ['pdf', 'txt'].includes(doc.type) && doc.status === 'indexed'
      ).length,
      avgHitRate: calculateAvgHitRate(documents.filter(doc => 
        ['pdf', 'txt'].includes(doc.type) && doc.status === 'indexed'
      )),
      totalSearches: calculateTotalSearches(documents.filter(doc => 
        ['pdf', 'txt'].includes(doc.type) && doc.status === 'indexed'
      )),
    },
    // 动态数据仪表板
    dashboard: {
      relevantDocs: documents.filter(doc => 
        ['xlsx', 'pptx'].includes(doc.type) && doc.status === 'indexed'
      ).length,
      avgHitRate: calculateAvgHitRate(documents.filter(doc => 
        ['xlsx', 'pptx'].includes(doc.type) && doc.status === 'indexed'
      )),
      totalSearches: calculateTotalSearches(documents.filter(doc => 
        ['xlsx', 'pptx'].includes(doc.type) && doc.status === 'indexed'
      )),
    },
    // 自动化文档生成
    docGeneration: {
      relevantDocs: documents.filter(doc => 
        ['docx', 'pdf'].includes(doc.type)
      ).length,
      avgHitRate: calculateAvgHitRate(documents.filter(doc => 
        ['docx', 'pdf'].includes(doc.type)
      )),
      totalSearches: calculateTotalSearches(documents.filter(doc => 
        ['docx', 'pdf'].includes(doc.type)
      )),
    },
    // 实时数据分析管道
    dataPipeline: {
      relevantDocs: documents.filter(doc => 
        ['xlsx', 'txt'].includes(doc.type)
      ).length,
      avgHitRate: calculateAvgHitRate(documents.filter(doc => 
        ['xlsx', 'txt'].includes(doc.type)
      )),
      totalSearches: calculateTotalSearches(documents.filter(doc => 
        ['xlsx', 'txt'].includes(doc.type)
      )),
    }
  };

  // 辅助函数：计算平均命中率
  function calculateAvgHitRate(docs: Document[]): number {
    if (docs.length === 0) return 0;
    return docs.reduce((sum, doc) => sum + parseFloat(doc.usageStats.hitRate.toString()), 0) / docs.length;
  }

  // 辅助函数：计算总检索次数
  function calculateTotalSearches(docs: Document[]): number {
    return docs.reduce((sum, doc) => sum + doc.usageStats.searchCount, 0);
  }

  // 格式化文件大小
  const formatFileSize = (sizeInKB: number) => {
    if (sizeInKB < 1024) {
      return `${sizeInKB} KB`;
    } else {
      return `${(sizeInKB / 1024).toFixed(2)} MB`;
    }
  };

  // 格式化百分比
  const formatPercent = (value: number) => {
    return `${(value * 100).toFixed(2)}%`;
  };

  // 渲染状态分布条形图
  const renderStatusChart = () => {
    const total = stats.totalDocuments;
    if (total === 0) return null;
    
    return (
      <div className="mt-2">
        <div className="flex h-4 overflow-hidden rounded bg-gray-200">
          <div 
            className="bg-yellow-400"
            style={{ width: `${(stats.byStatus.processing / total) * 100}%` }}
            title={`处理中: ${stats.byStatus.processing}`}
          />
          <div 
            className="bg-green-400"
            style={{ width: `${(stats.byStatus.indexed / total) * 100}%` }}
            title={`已索引: ${stats.byStatus.indexed}`}
          />
          <div 
            className="bg-red-400"
            style={{ width: `${(stats.byStatus.failed / total) * 100}%` }}
            title={`索引失败: ${stats.byStatus.failed}`}
          />
        </div>
        <div className="flex justify-between text-xs mt-1 text-gray-500">
          <span>处理中: {stats.byStatus.processing}</span>
          <span>已索引: {stats.byStatus.indexed}</span>
          <span>失败: {stats.byStatus.failed}</span>
        </div>
      </div>
    );
  };

  // 渲染类型分布
  const renderTypeDistribution = () => {
    const typeLabels: Record<string, string> = {
      pdf: 'PDF',
      docx: 'Word',
      xlsx: 'Excel',
      pptx: 'PowerPoint',
      image: '图片',
      txt: '文本',
      other: '其他'
    };
    
    const sortedTypes = Object.entries(stats.byType)
      .sort(([, countA], [, countB]) => countB - countA)
      .slice(0, 4); // 只显示前4种类型
    
    return (
      <div className="space-y-1 mt-2">
        {sortedTypes.map(([type, count]) => (
          <div key={type} className="flex items-center text-xs">
            <span className="w-20 truncate">{typeLabels[type]}</span>
            <div className="flex-1 mx-2">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-400"
                  style={{ width: `${(count / stats.totalDocuments) * 100}%` }}
                />
              </div>
            </div>
            <span className="text-gray-500">{count}</span>
          </div>
        ))}
      </div>
    );
  };

  // 渲染应用场景相关统计
  const renderScenarioStats = () => {
    return (
      <div className="space-y-4 mt-2">
        {/* 智能客服系统 */}
        <div>
          <h5 className="text-xs font-medium">智能客服系统</h5>
          <div className="grid grid-cols-3 gap-2 mt-1">
            <div className="bg-gray-50 p-2 rounded">
              <div className="text-xs text-gray-500">相关文档</div>
              <div className="text-sm font-semibold">{scenarioStats.customerService.relevantDocs}</div>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <div className="text-xs text-gray-500">平均命中率</div>
              <div className="text-sm font-semibold">{formatPercent(scenarioStats.customerService.avgHitRate)}</div>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <div className="text-xs text-gray-500">检索总次数</div>
              <div className="text-sm font-semibold">{scenarioStats.customerService.totalSearches}</div>
            </div>
          </div>
        </div>
        
        {/* 动态数据仪表板 */}
        <div>
          <h5 className="text-xs font-medium">动态数据仪表板</h5>
          <div className="grid grid-cols-3 gap-2 mt-1">
            <div className="bg-gray-50 p-2 rounded">
              <div className="text-xs text-gray-500">相关文档</div>
              <div className="text-sm font-semibold">{scenarioStats.dashboard.relevantDocs}</div>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <div className="text-xs text-gray-500">平均命中率</div>
              <div className="text-sm font-semibold">{formatPercent(scenarioStats.dashboard.avgHitRate)}</div>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <div className="text-xs text-gray-500">检索总次数</div>
              <div className="text-sm font-semibold">{scenarioStats.dashboard.totalSearches}</div>
            </div>
          </div>
        </div>
        
        {/* 自动化文档生成 */}
        <div>
          <h5 className="text-xs font-medium">自动化文档生成</h5>
          <div className="grid grid-cols-3 gap-2 mt-1">
            <div className="bg-gray-50 p-2 rounded">
              <div className="text-xs text-gray-500">相关文档</div>
              <div className="text-sm font-semibold">{scenarioStats.docGeneration.relevantDocs}</div>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <div className="text-xs text-gray-500">平均命中率</div>
              <div className="text-sm font-semibold">{formatPercent(scenarioStats.docGeneration.avgHitRate)}</div>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <div className="text-xs text-gray-500">检索总次数</div>
              <div className="text-sm font-semibold">{scenarioStats.docGeneration.totalSearches}</div>
            </div>
          </div>
        </div>
        
        {/* 实时数据分析管道 */}
        <div>
          <h5 className="text-xs font-medium">实时数据分析管道</h5>
          <div className="grid grid-cols-3 gap-2 mt-1">
            <div className="bg-gray-50 p-2 rounded">
              <div className="text-xs text-gray-500">相关文档</div>
              <div className="text-sm font-semibold">{scenarioStats.dataPipeline.relevantDocs}</div>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <div className="text-xs text-gray-500">平均命中率</div>
              <div className="text-sm font-semibold">{formatPercent(scenarioStats.dataPipeline.avgHitRate)}</div>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <div className="text-xs text-gray-500">检索总次数</div>
              <div className="text-sm font-semibold">{scenarioStats.dataPipeline.totalSearches}</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div 
        className="bg-gray-50 px-4 py-3 flex justify-between items-center cursor-pointer border-b"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <FaChartBar className="text-gray-500 mr-2" />
          <h3 className="text-sm font-medium text-gray-700">文档统计</h3>
        </div>
        {isExpanded ? <FaCaretUp className="text-gray-500" /> : <FaCaretDown className="text-gray-500" />}
      </div>
      
      {isExpanded && (
        <div className="p-4">
          {/* 选项卡 */}
          <div className="flex border-b mb-4">
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'usage' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('usage')}
            >
              使用情况
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

          {activeTab === 'usage' ? (
            <>
              {/* 基本统计 */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-xs text-gray-500">文档总数</div>
                  <div className="text-lg font-semibold">{stats.totalDocuments}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-xs text-gray-500">总大小</div>
                  <div className="text-lg font-semibold">{formatFileSize(stats.totalSize)}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-xs text-gray-500">检索总次数</div>
                  <div className="text-lg font-semibold">{stats.totalSearchCount}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-xs text-gray-500">平均命中率</div>
                  <div className="text-lg font-semibold">{formatPercent(stats.averageHitRate)}</div>
                </div>
              </div>
              
              {/* 状态分布 */}
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  状态分布
                </h4>
                {renderStatusChart()}
              </div>
              
              {/* 类型分布 */}
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  类型分布 (Top 4)
                </h4>
                {renderTypeDistribution()}
              </div>
            </>
          ) : (
            /* 应用场景相关统计 */
            renderScenarioStats()
          )}
        </div>
      )}
    </div>
  );
};

export default StatisticsPanel;
