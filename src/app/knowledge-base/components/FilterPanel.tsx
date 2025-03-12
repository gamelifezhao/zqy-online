'use client';

import { useState } from 'react';
import { FaFilter, FaCaretDown, FaCaretUp } from 'react-icons/fa';
import { DatePicker } from 'antd';
import { useKnowledgeBase } from '../page';
import { Document } from '../types';

const FilterPanel = () => {
  const { filterOptions, setFilterOptions } = useKnowledgeBase();
  const [isExpanded, setIsExpanded] = useState(true);

  // 文档类型选项
  const typeOptions: Array<{ value: Document['type'], label: string }> = [
    { value: 'pdf', label: 'PDF文档' },
    { value: 'docx', label: 'Word文档' },
    { value: 'xlsx', label: 'Excel表格' },
    { value: 'pptx', label: '演示文稿' },
    { value: 'image', label: '图片' },
    { value: 'txt', label: '文本文件' },
    { value: 'other', label: '其他' },
  ];

  // 状态选项
  const statusOptions: Array<{ value: Document['status'], label: string }> = [
    { value: 'processing', label: '处理中' },
    { value: 'indexed', label: '已索引' },
    { value: 'failed', label: '索引失败' },
  ];

  // 处理类型过滤变化
  const handleTypeChange = (type: Document['type']) => {
    setFilterOptions((prev: any) => {
      const types = prev.types.includes(type)
        ? prev.types.filter((t:any) => t !== type)
        : [...prev.types, type];

      return { ...prev, types };
    });
  };

  // 处理状态过滤变化
  const handleStatusChange = (status: Document['status']) => {
    setFilterOptions((prev: any) => {
      const statuses = prev.status.includes(status)
        ? prev.status.filter((s: string) => s !== status)
        : [...prev.status, status];

      return { ...prev, status: statuses };
    });
  };

  // 处理大小范围变化
  const handleSizeRangeChange = (min: number | null, max: number | null) => {
    setFilterOptions((prev: any) => ({
      ...prev,
      sizeRange: { min, max },
    }));
  };

  // 处理日期变化
  const handleDateChange = (date: Date | null) => {
    setFilterOptions((prev: any) => ({
      ...prev,
      date: date,
    }));
  };

  // 重置所有过滤器
  const resetFilters = () => {
    setFilterOptions({
      types: [],
      status: [],
      date: null,
      sizeRange: { min: null, max: null },
    });
  };

  // 解析日期字符串为Date对象或null
  const parseDate = (dateStr: string): Date | null => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? null : date;
  };

  // 应用场景预设过滤器
  const applyScenarioPreset = (scenario: string) => {
    switch (scenario) {
      case 'customer-service':
        // 智能客服系统场景 - 过滤已索引的PDF和文本文档
        setFilterOptions({
          types: ['pdf', 'txt'],
          status: ['indexed'],
          date: null,
          sizeRange: { min: null, max: null },
        });
        break;
      case 'dashboard':
        // 动态数据仪表板场景 - 过滤Excel和演示文稿
        setFilterOptions({
          types: ['xlsx', 'pptx'],
          status: ['indexed'],
          date: null,
          sizeRange: { min: null, max: null },
        });
        break;
      case 'doc-generation':
        // 自动化文档生成场景 - 过滤Word和PDF
        setFilterOptions({
          types: ['docx', 'pdf'],
          status: [],
          date: null,
          sizeRange: { min: null, max: null },
        });
        break;
      case 'data-pipeline':
        // 实时数据分析管道场景 - 过滤Excel和文本文件
        setFilterOptions({
          types: ['xlsx', 'txt'],
          status: [],
          date: null,
          sizeRange: { min: null, max: null },
        });
        break;
      default:
        resetFilters();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div
        className="bg-gray-50 px-4 py-3 flex justify-between items-center cursor-pointer border-b"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <FaFilter className="text-gray-500 mr-2" />
          <h3 className="text-sm font-medium text-gray-700">高级筛选</h3>
        </div>
        {isExpanded ? <FaCaretUp className="text-gray-500" /> : <FaCaretDown className="text-gray-500" />}
      </div>

      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* 应用场景预设 */}
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              应用场景预设
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <button
                className="px-2 py-1 text-xs border rounded hover:bg-gray-50"
                onClick={() => applyScenarioPreset('customer-service')}
              >
                智能客服系统
              </button>
              <button
                className="px-2 py-1 text-xs border rounded hover:bg-gray-50"
                onClick={() => applyScenarioPreset('dashboard')}
              >
                动态数据仪表板
              </button>
              <button
                className="px-2 py-1 text-xs border rounded hover:bg-gray-50"
                onClick={() => applyScenarioPreset('doc-generation')}
              >
                自动化文档生成
              </button>
              <button
                className="px-2 py-1 text-xs border rounded hover:bg-gray-50"
                onClick={() => applyScenarioPreset('data-pipeline')}
              >
                实时数据分析管道
              </button>
            </div>
          </div>

          {/* 文档类型 */}
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              文档类型
            </h4>
            <div className="space-y-2">
              {typeOptions.map(option => (
                <label key={option.value} className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    checked={filterOptions.types.includes(option.value)}
                    onChange={() => handleTypeChange(option.value)}
                  />
                  <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 文档状态 */}
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              文档状态
            </h4>
            <div className="space-y-2">
              {statusOptions.map(option => (
                <label key={option.value} className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    checked={filterOptions.status.includes(option.value)}
                    onChange={() => handleStatusChange(option.value)}
                  />
                  <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 文件大小范围 */}
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              文件大小 (KB)
            </h4>
            <div className="flex space-x-2">
              <input
                type="number"
                placeholder="最小"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                value={filterOptions.sizeRange.min !== null ? filterOptions.sizeRange.min : ''}
                onChange={(e) => {
                  const value = e.target.value ? parseInt(e.target.value) : null;
                  handleSizeRangeChange(value, filterOptions.sizeRange.max);
                }}
                min="0"
              />
              <span className="text-gray-500 flex items-center">至</span>
              <input
                type="number"
                placeholder="最大"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                value={filterOptions.sizeRange.max !== null ? filterOptions.sizeRange.max : ''}
                onChange={(e) => {
                  const value = e.target.value ? parseInt(e.target.value) : null;
                  handleSizeRangeChange(filterOptions.sizeRange.min, value);
                }}
                min="0"
              />
            </div>
          </div>

          {/* 上传日期 */}
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              上传日期
            </h4>
            <div>
              <DatePicker 
                className="block w-full" 
                placeholder="选择日期"
                value={filterOptions.date ? new Date(filterOptions.date) : null}
                onChange={(date: any) => handleDateChange(date ? new Date(date) : null)}
                format="YYYY-MM-DD"
              />
            </div>
          </div>

          {/* 重置按钮 */}
          <div className="pt-2">
            <button
              onClick={resetFilters}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 
                        bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              重置所有筛选条件
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
