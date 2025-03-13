'use client';

import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { 
  FiBell, 
  FiCpu, 
  FiDatabase, 
  FiGitBranch, 
  FiSend, 
  FiBarChart2, 
  FiTrendingUp, 
  FiMessageSquare,
  FiFileText,
  FiSearch,
  FiGrid,
  FiPieChart,
  FiActivity,
  FiClock,
  FiServer,
  FiLayers
} from 'react-icons/fi';

const nodeStyles = {
  padding: '10px 15px',
  borderRadius: '6px',
  width: '180px',
  fontSize: '14px',
  color: '#1f2937',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '5px',
};

const nodeHeaderStyles = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginBottom: '5px',
};

const nodeIconStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '28px',
  height: '28px',
  borderRadius: '4px',
  fontSize: '16px',
};

const nodeTitleStyles = {
  fontWeight: '500' as const,
  fontSize: '14px',
  flex: 1,
};

const nodeContentStyles = {
  fontSize: '12px',
  color: '#6b7280',
  padding: '3px 0',
};

const nodeFooterStyles = {
  marginTop: '5px',
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '11px',
  color: '#9ca3af',
};

export const TriggerNode = memo(({ data, selected }: any) => {
  const subType = data.subType || 'default';
  const label = subType === 'scheduled' ? '定时触发器' : '默认触发器';
  const description = subType === 'scheduled' ? '按计划启动工作流' : '开始工作流执行';
  
  return (
    <div
      style={{
        ...nodeStyles,
        background: '#fff1f2',
        border: selected ? '2px solid #f43f5e' : '1px solid #fecdd3',
      }}
    >
      <div style={nodeHeaderStyles}>
        <div style={{
          ...nodeIconStyles,
          backgroundColor: '#fee2e2',
          color: '#f43f5e',
        }}>
          <FiBell />
        </div>
        <div style={nodeTitleStyles}>{label}</div>
      </div>
      <div style={nodeContentStyles}>{description}</div>
      <div style={nodeFooterStyles}>
        <span>{data.id}</span>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          background: '#f43f5e',
          width: '8px',
          height: '8px',
          border: '2px solid white',
        }}
      />
    </div>
  );
});

export const AINode = memo(({ data, selected }: any) => {
  const subType = data.subType || 'completion';
  const label = subType === 'chat' ? '聊天节点' : '文本生成';
  const description = subType === 'chat' ? '进行对话交互' : '生成文本内容';
  const Icon = subType === 'chat' ? FiMessageSquare : FiCpu;

  return (
    <div
      style={{
        ...nodeStyles,
        background: '#eff6ff',
        border: selected ? '2px solid #3b82f6' : '1px solid #bfdbfe',
      }}
    >
      <div style={nodeHeaderStyles}>
        <div style={{
          ...nodeIconStyles,
          backgroundColor: '#dbeafe',
          color: '#3b82f6',
        }}>
          <Icon />
        </div>
        <div style={nodeTitleStyles}>{label}</div>
      </div>
      <div style={nodeContentStyles}>{description}</div>
      <div style={nodeFooterStyles}>
        <span>{data.id}</span>
      </div>

      <Handle
        type="target"
        position={Position.Top}
        style={{
          background: '#3b82f6',
          width: '8px',
          height: '8px',
          border: '2px solid white',
        }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          background: '#3b82f6',
          width: '8px',
          height: '8px',
          border: '2px solid white',
        }}
      />
    </div>
  );
});

export const ConditionNode = memo(({ data, selected }: any) => {
  const subType = data.subType || 'if';
  const label = 'IF 条件';
  const description = '基于条件执行不同的分支';

  return (
    <div
      style={{
        ...nodeStyles,
        background: '#fffbeb',
        border: selected ? '2px solid #d97706' : '1px solid #fde68a',
      }}
    >
      <div style={nodeHeaderStyles}>
        <div style={{
          ...nodeIconStyles,
          backgroundColor: '#fef3c7',
          color: '#d97706',
        }}>
          <FiGitBranch />
        </div>
        <div style={nodeTitleStyles}>{label}</div>
      </div>
      <div style={nodeContentStyles}>{description}</div>
      <div style={nodeFooterStyles}>
        <span>{data.id}</span>
      </div>

      <Handle
        type="target"
        position={Position.Top}
        style={{
          background: '#d97706',
          width: '8px',
          height: '8px',
          border: '2px solid white',
        }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="true"
        style={{
          background: '#d97706',
          width: '8px',
          height: '8px',
          border: '2px solid white',
          left: '30%',
        }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="false"
        style={{
          background: '#d97706',
          width: '8px',
          height: '8px',
          border: '2px solid white',
          left: '70%',
        }}
      />
    </div>
  );
});

export const DataSourceNode = memo(({ data, selected }: any) => {
  const subType = data.subType || 'api';
  const label = subType === 'database' ? '数据库' : 'API 数据源';
  const description = subType === 'database' ? '从数据库获取数据' : '从 API 获取数据';

  return (
    <div
      style={{
        ...nodeStyles,
        background: '#ecfdf5',
        border: selected ? '2px solid #10b981' : '1px solid #a7f3d0',
      }}
    >
      <div style={nodeHeaderStyles}>
        <div style={{
          ...nodeIconStyles,
          backgroundColor: '#d1fae5',
          color: '#10b981',
        }}>
          <FiDatabase />
        </div>
        <div style={nodeTitleStyles}>{label}</div>
      </div>
      <div style={nodeContentStyles}>{description}</div>
      <div style={nodeFooterStyles}>
        <span>{data.id}</span>
      </div>

      <Handle
        type="target"
        position={Position.Top}
        style={{
          background: '#10b981',
          width: '8px',
          height: '8px',
          border: '2px solid white',
        }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          background: '#10b981',
          width: '8px',
          height: '8px',
          border: '2px solid white',
        }}
      />
    </div>
  );
});

export const VisualizationNode = memo(({ data, selected }: any) => {
  // 获取子类型
  const subType = data.subType || 'chart';
  const label = data.label || (subType === 'dashboard' ? '动态仪表盘' : '图表节点');
  const description = subType === 'dashboard' 
    ? '创建动态数据仪表盘，支持多图表组合展示' 
    : '可视化数据图表，支持多种图表类型';

  // 获取图表类型的显示名称
  const getChartTypeName = (chartType: string): string => {
    switch (chartType) {
      case 'bar': return '柱状图';
      case 'line': return '折线图';
      case 'pie': return '饼图';
      case 'scatter': return '散点图';
      case 'area': return '面积图';
      case 'radar': return '雷达图';
      case 'multiple': return '多图表';
      default: return chartType;
    }
  };

  // 从配置中获取图表类型
  const chartType = data.config?.chartType || 'bar';
  
  return (
    <div
      style={{
        ...nodeStyles,
        backgroundColor: selected ? '#e0e7ff' : '#f3f4f6',
        borderColor: selected ? '#6366f1' : '#e5e7eb',
        borderWidth: '2px',
        borderStyle: 'solid',
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: '#94a3b8', width: '8px', height: '8px' }}
      />
      
      <div style={nodeHeaderStyles}>
        <div 
          style={{
            ...nodeIconStyles,
            backgroundColor: '#e0e7ff',
            color: '#6366f1'
          }}
        >
          {subType === 'dashboard' ? <FiGrid /> : <FiPieChart />}
        </div>
        <strong>{label}</strong>
      </div>
      
      <div style={{ fontSize: '12px', color: '#4b5563', margin: '2px 0' }}>
        {description}
      </div>
      
      {data.config && (
        <div style={{ fontSize: '12px', backgroundColor: '#f9fafb', padding: '5px', borderRadius: '4px', marginTop: '5px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#4b5563' }}>图表类型:</span>
            <span style={{ color: '#6366f1', fontWeight: 500 }}>{getChartTypeName(chartType)}</span>
          </div>
          {data.config.chartTitle && (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#4b5563' }}>标题:</span>
              <span style={{ color: '#1f2937' }}>{data.config.chartTitle}</span>
            </div>
          )}
        </div>
      )}
      
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: '#94a3b8', width: '8px', height: '8px' }}
      />
    </div>
  );
});

export const AnalysisNode = memo(({ data, selected }: any) => {
  // 获取子类型
  const subType = data.subType || 'batch';
  const label = data.label || (subType === 'realtime' ? '实时分析' : '批量分析');
  const description = subType === 'realtime' 
    ? '实时数据分析管道，处理流式数据' 
    : '批量数据分析，处理大规模数据集';

  // 获取脚本类型的显示名称
  const getScriptTypeName = (scriptType: string): string => {
    switch (scriptType) {
      case 'python': return 'Python';
      case 'javascript': return 'JavaScript';
      case 'sql': return 'SQL';
      default: return scriptType;
    }
  };
  
  // 从配置中获取脚本类型
  const scriptType = data.config?.scriptType || 'python';
  
  return (
    <div
      style={{
        ...nodeStyles,
        backgroundColor: selected ? '#fae8ff' : '#f3f4f6',
        borderColor: selected ? '#d946ef' : '#e5e7eb',
        borderWidth: '2px',
        borderStyle: 'solid',
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: '#94a3b8', width: '8px', height: '8px' }}
      />
      
      <div style={nodeHeaderStyles}>
        <div 
          style={{
            ...nodeIconStyles,
            backgroundColor: '#fae8ff',
            color: '#d946ef'
          }}
        >
          {subType === 'realtime' ? <FiActivity /> : <FiLayers />}
        </div>
        <strong>{label}</strong>
      </div>
      
      <div style={{ fontSize: '12px', color: '#4b5563', margin: '2px 0' }}>
        {description}
      </div>
      
      {data.config && (
        <div style={{ fontSize: '12px', backgroundColor: '#f9fafb', padding: '5px', borderRadius: '4px', marginTop: '5px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#4b5563' }}>分析类型:</span>
            <span style={{ color: '#d946ef', fontWeight: 500 }}>{subType === 'realtime' ? '实时处理' : '批量处理'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#4b5563' }}>脚本语言:</span>
            <span style={{ color: '#1f2937' }}>{getScriptTypeName(scriptType)}</span>
          </div>
        </div>
      )}
      
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: '#94a3b8', width: '8px', height: '8px' }}
      />
    </div>
  );
});

export const OutputNode = memo(({ data, selected }: any) => {
  const subType = data.subType || 'message';
  const label = subType === 'document' ? '文档生成' : '消息输出';
  const description = subType === 'document' ? '生成和输出文档' : '发送消息或通知';
  const Icon = subType === 'document' ? FiFileText : FiSend;

  return (
    <div
      style={{
        ...nodeStyles,
        background: '#f3f4f6',
        border: selected ? '2px solid #4b5563' : '1px solid #d1d5db',
      }}
    >
      <div style={nodeHeaderStyles}>
        <div style={{
          ...nodeIconStyles,
          backgroundColor: '#e5e7eb',
          color: '#4b5563',
        }}>
          <Icon />
        </div>
        <div style={nodeTitleStyles}>{label}</div>
      </div>
      <div style={nodeContentStyles}>{description}</div>
      <div style={nodeFooterStyles}>
        <span>{data.id}</span>
      </div>

      <Handle
        type="target"
        position={Position.Top}
        style={{
          background: '#4b5563',
          width: '8px',
          height: '8px',
          border: '2px solid white',
        }}
      />
    </div>
  );
});
