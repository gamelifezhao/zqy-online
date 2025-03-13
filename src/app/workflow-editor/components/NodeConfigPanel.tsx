'use client';

import React, { useState, useEffect } from 'react';
import { Node } from 'reactflow';
import { 
  FiBarChart2, 
  FiCpu, 
  FiDatabase, 
  FiGitBranch, 
  FiSend, 
  FiBell,
  FiMessageSquare,
  FiX,
  FiCode,
  FiPieChart,
  FiTrendingUp
} from 'react-icons/fi';

// CSS样式
const configPanelStyles = `
  .node-config-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 8px 0;
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  
  .form-group-split {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
  
  .form-label {
    font-weight: 500;
    font-size: 14px;
    color: #1f2937;
  }
  
  .form-select {
    padding: 8px 12px;
    border-radius: 6px;
    border: 1px solid #d1d5db;
    font-size: 14px;
    background-color: #fff;
    width: 100%;
  }
  
  .form-input {
    padding: 8px 12px;
    border-radius: 6px;
    border: 1px solid #d1d5db;
    font-size: 14px;
    background-color: #fff;
    width: 100%;
  }
  
  .form-textarea {
    padding: 8px 12px;
    border-radius: 6px;
    border: 1px solid #d1d5db;
    font-size: 14px;
    background-color: #fff;
    width: 100%;
    resize: vertical;
  }
  
  .code-editor {
    font-family: monospace;
    background-color: #f9fafb;
    line-height: 1.5;
  }
  
  .form-range {
    width: 100%;
  }
  
  .range-labels {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: #6b7280;
    margin-top: 4px;
  }
  
  .form-hint {
    font-size: 12px;
    color: #6b7280;
    margin-top: 4px;
  }
  
  .form-section-title {
    font-weight: 600;
    font-size: 15px;
    color: #1f2937;
    margin-top: 8px;
    margin-bottom: 8px;
    padding-bottom: 4px;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .form-button {
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 14px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    transition: all 0.2s;
  }
  
  .form-button.primary {
    background-color: #6366f1;
    color: #fff;
    border: none;
  }
  
  .form-button.primary:hover {
    background-color: #4f46e5;
  }
  
  .form-button.secondary {
    background-color: #f3f4f6;
    color: #1f2937;
    border: 1px solid #d1d5db;
  }
  
  .form-button.secondary:hover {
    background-color: #e5e7eb;
  }
  
  .node-config-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .node-config-header-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 6px;
    font-size: 18px;
  }
  
  .node-config-header-title {
    font-size: 18px;
    font-weight: 600;
    color: #1f2937;
    margin: 0;
  }
  
  .dashboard-config {
    background-color: #f9fafb;
    border-radius: 6px;
    padding: 12px;
    margin-top: 8px;
  }
`;

interface NodeConfigPanelProps {
  node: Node;
  onClose: () => void;
  onUpdateNodeData: (nodeId: string, data: any) => void;
}

// 可视化节点配置面板
const VisualizationNodeConfig: React.FC<{
  node: Node;
  onUpdateNodeData: (nodeId: string, data: any) => void;
}> = ({ node, onUpdateNodeData }) => {
  const [chartType, setChartType] = useState(node.data.config?.chartType || 'bar');
  const [chartTitle, setChartTitle] = useState(node.data.config?.chartTitle || '');
  const [dataSource, setDataSource] = useState(node.data.config?.dataSource || '');
  const [refreshInterval, setRefreshInterval] = useState(node.data.config?.refreshInterval || 60);
  const [chartTheme, setChartTheme] = useState(node.data.config?.chartTheme || 'light');
  const [sampleData, setSampleData] = useState(node.data.config?.sampleData || '');

  // 更新节点数据
  const updateNodeData = () => {
    const newConfig = {
      chartType,
      chartTitle,
      dataSource,
      refreshInterval,
      chartTheme,
      sampleData
    };
    
    onUpdateNodeData(node.id, {
      ...node.data,
      config: newConfig
    });
  };

  // 检测配置变化时更新节点
  useEffect(() => {
    updateNodeData();
  }, [chartType, chartTitle, dataSource, refreshInterval, chartTheme, sampleData]);

  // 默认的示例数据
  const generateDefaultSampleData = (type: string) => {
    const baseData = {
      labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
      datasets: [
        {
          label: '数据集A',
          data: [65, 59, 80, 81, 56, 55],
          backgroundColor: 'rgba(99, 102, 241, 0.6)',
        }
      ]
    };

    if (type === 'pie') {
      return JSON.stringify({
        labels: ['数据1', '数据2', '数据3', '数据4', '数据5'],
        datasets: [{
          data: [30, 50, 20, 10, 15],
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)'
          ]
        }]
      }, null, 2);
    } else if (type === 'radar') {
      return JSON.stringify({
        labels: ['分类A', '分类B', '分类C', '分类D', '分类E', '分类F'],
        datasets: [{
          label: '数据集A',
          data: [65, 59, 90, 81, 56, 55],
          backgroundColor: 'rgba(99, 102, 241, 0.2)',
          borderColor: 'rgba(99, 102, 241, 1)',
        }, {
          label: '数据集B',
          data: [28, 48, 40, 19, 96, 27],
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
        }]
      }, null, 2);
    }
    
    return JSON.stringify(baseData, null, 2);
  };

  // 当图表类型变更时更新示例数据
  useEffect(() => {
    if (!sampleData || sampleData.trim() === '') {
      setSampleData(generateDefaultSampleData(chartType));
    }
  }, [chartType]);

  return (
    <div className="node-config-form">
      <div className="form-group">
        <label>图表类型</label>
        <select 
          value={chartType} 
          onChange={(e) => setChartType(e.target.value)}
          className="form-select"
        >
          <option value="bar">柱状图</option>
          <option value="line">折线图</option>
          <option value="pie">饼图</option>
          <option value="scatter">散点图</option>
          <option value="area">面积图</option>
          <option value="radar">雷达图</option>
          {node.data.subType === 'dashboard' && (
            <option value="multiple">多图表</option>
          )}
        </select>
      </div>

      <div className="form-group">
        <label>图表标题</label>
        <input 
          type="text" 
          value={chartTitle} 
          onChange={(e) => setChartTitle(e.target.value)} 
          placeholder="输入图表标题..."
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label>数据源</label>
        <select 
          value={dataSource} 
          onChange={(e) => setDataSource(e.target.value)}
          className="form-select"
        >
          <option value="">选择数据源...</option>
          <option value="node">上游节点数据</option>
          <option value="api">API数据</option>
          <option value="database">数据库</option>
          <option value="sample">示例数据</option>
        </select>
      </div>

      <div className="form-group">
        <label>刷新间隔 (秒)</label>
        <input 
          type="number" 
          value={refreshInterval} 
          min={0}
          onChange={(e) => setRefreshInterval(parseInt(e.target.value))} 
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label>图表主题</label>
        <select 
          value={chartTheme} 
          onChange={(e) => setChartTheme(e.target.value)}
          className="form-select"
        >
          <option value="light">浅色</option>
          <option value="dark">深色</option>
          <option value="custom">自定义</option>
        </select>
      </div>

      <div className="form-group">
        <label>示例数据 (JSON)</label>
        <textarea 
          value={sampleData} 
          onChange={(e) => setSampleData(e.target.value)} 
          className="form-textarea code-editor"
          rows={8}
        />
        <div className="form-hint">
          支持Chart.js格式的数据，将自动转换为ECharts渲染
        </div>
      </div>

      {chartType === 'multiple' && node.data.subType === 'dashboard' && (
        <div className="dashboard-config">
          <div className="form-section-title">仪表板配置</div>
          <div className="form-hint">
            仪表板模式下可以组合多个图表，形成动态数据仪表板
          </div>
        </div>
      )}
    </div>
  );
};

// 分析节点配置面板
const AnalysisNodeConfig: React.FC<{
  node: Node;
  onUpdateNodeData: (nodeId: string, data: any) => void;
}> = ({ node, onUpdateNodeData }) => {
  const [analysisType, setAnalysisType] = useState(node.data.config?.analysisType || 'batch');
  const [inputSource, setInputSource] = useState(node.data.config?.inputSource || '');
  const [outputTarget, setOutputTarget] = useState(node.data.config?.outputTarget || '');
  const [scriptType, setScriptType] = useState(node.data.config?.scriptType || 'python');
  const [scriptContent, setScriptContent] = useState(node.data.config?.scriptContent || '');

  // 更新节点数据
  const updateNodeData = () => {
    const newConfig = {
      analysisType,
      inputSource,
      outputTarget,
      scriptType,
      scriptContent
    };
    
    onUpdateNodeData(node.id, {
      ...node.data,
      config: newConfig
    });
  };

  // 检测配置变化时更新节点
  useEffect(() => {
    updateNodeData();
  }, [analysisType, inputSource, outputTarget, scriptType, scriptContent]);

  // 生成默认脚本内容
  const generateDefaultScript = (scriptLang: string, type: string) => {
    if (scriptLang === 'python') {
      if (type === 'realtime') {
        return `# 实时数据分析脚本
import json
from datetime import datetime

def process_stream(data_stream):
    """
    处理实时数据流
    :param data_stream: 输入的数据流
    :return: 处理后的结果
    """
    result = []
    
    # 在这里添加数据处理逻辑
    for data in data_stream:
        # 示例：为每条数据添加时间戳
        processed = {
            'timestamp': datetime.now().isoformat(),
            'value': data['value'],
            'processed': data['value'] * 2  # 示例处理
        }
        result.append(processed)
    
    return result

# 用于测试的示例代码
if __name__ == "__main__":
    test_stream = [{'value': 10}, {'value': 20}, {'value': 30}]
    print(process_stream(test_stream))
`;
      } else {
        return `# 批处理数据分析脚本
import pandas as pd
import numpy as np

def analyze_batch_data(data):
    """
    批量分析数据
    :param data: 输入数据（可以是DataFrame或字典列表）
    :return: 分析结果
    """
    # 将输入数据转换为DataFrame
    if not isinstance(data, pd.DataFrame):
        df = pd.DataFrame(data)
    else:
        df = data
    
    # 在这里添加数据分析逻辑
    # 示例：计算基本统计信息
    result = {
        'summary': df.describe().to_dict(),
        'column_types': {col: str(dtype) for col, dtype in df.dtypes.items()},
        'row_count': len(df)
    }
    
    # 如果有数值列，计算相关性
    numeric_cols = df.select_dtypes(include=[np.number]).columns
    if len(numeric_cols) > 1:
        result['correlation'] = df[numeric_cols].corr().to_dict()
    
    return result

# 用于测试的示例代码
if __name__ == "__main__":
    # 创建测试数据
    test_data = {
        'value': [10, 20, 30, 40, 50],
        'category': ['A', 'B', 'A', 'C', 'B']
    }
    print(analyze_batch_data(test_data))
`;
      }
    } else if (scriptLang === 'javascript') {
      if (type === 'realtime') {
        return `// 实时数据分析脚本

/**
 * 处理实时数据流
 * @param {Array} dataStream - 输入的数据流
 * @return {Array} 处理后的结果
 */
function processStream(dataStream) {
  const result = [];
  
  // 在这里添加数据处理逻辑
  dataStream.forEach(data => {
    // 示例：为每条数据添加时间戳和处理后的值
    const processed = {
      timestamp: new Date().toISOString(),
      value: data.value,
      processed: data.value * 2  // 示例处理
    };
    result.push(processed);
  });
  
  return result;
}

// 用于测试的示例代码
const testStream = [
  { value: 10 }, 
  { value: 20 }, 
  { value: 30 }
];
console.log(processStream(testStream));
`;
      } else {
        return `// 批处理数据分析脚本

/**
 * 批量分析数据
 * @param {Array} data - 输入数据（对象数组）
 * @return {Object} 分析结果
 */
function analyzeBatchData(data) {
  // 在这里添加数据分析逻辑
  
  // 示例：计算基本统计信息
  const numericFields = {};
  
  // 识别所有数值字段
  if (data.length > 0) {
    Object.keys(data[0]).forEach(key => {
      if (typeof data[0][key] === 'number') {
        numericFields[key] = true;
      }
    });
  }
  
  // 计算数值字段的统计信息
  const stats = {};
  Object.keys(numericFields).forEach(field => {
    const values = data.map(item => item[field]).filter(v => !isNaN(v));
    const sum = values.reduce((acc, val) => acc + val, 0);
    const avg = sum / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);
    
    stats[field] = {
      count: values.length,
      sum: sum,
      avg: avg,
      min: min,
      max: max
    };
  });
  
  // 计算记录数
  const result = {
    rowCount: data.length,
    fields: Object.keys(data[0] || {}),
    stats: stats
  };
  
  return result;
}

// 用于测试的示例代码
const testData = [
  { value: 10, category: 'A' },
  { value: 20, category: 'B' },
  { value: 30, category: 'A' },
  { value: 40, category: 'C' },
  { value: 50, category: 'B' }
];
console.log(analyzeBatchData(testData));
`;
      }
    } else if (scriptLang === 'sql') {
      if (type === 'realtime') {
        return `-- 实时数据分析SQL查询
-- 假设有一个实时流表stream_data和一个结果表analysis_results

-- 示例1：简单聚合查询
SELECT 
  timestamp,
  AVG(value) as avg_value,
  MAX(value) as max_value,
  MIN(value) as min_value,
  COUNT(*) as record_count
FROM stream_data
GROUP BY TUMBLE(timestamp, INTERVAL '1' MINUTE);

-- 示例2：滑动窗口分析
SELECT
  device_id,
  window_start,
  window_end,
  AVG(value) as avg_value
FROM TABLE(
  TUMBLE(TABLE stream_data, DESCRIPTOR(timestamp), INTERVAL '5' MINUTE)
)
GROUP BY device_id, window_start, window_end;

-- 示例3：模式匹配（检测值的急剧变化）
SELECT *
FROM stream_data MATCH_RECOGNIZE (
  PARTITION BY device_id
  ORDER BY timestamp
  MEASURES
    FIRST(value) as start_value,
    LAST(value) as end_value,
    LAST(timestamp) as detection_time
  PATTERN (A B+ C)
  DEFINE
    A as value < 100,
    B as value >= 100 AND value < 200,
    C as value >= 200
) as pattern_matches;
`;
      } else {
        return `-- 批量数据分析SQL查询
-- 假设数据存储在batch_data表中

-- 示例1：基本统计分析
SELECT
  COUNT(*) as total_records,
  AVG(value) as average_value,
  STDDEV(value) as std_deviation,
  MIN(value) as min_value,
  MAX(value) as max_value
FROM batch_data
WHERE process_date = CURRENT_DATE - INTERVAL '1' DAY;

-- 示例2：按类别分组分析
SELECT
  category,
  COUNT(*) as category_count,
  AVG(value) as category_avg
FROM batch_data
GROUP BY category
ORDER BY category_count DESC;

-- 示例3：时间趋势分析
SELECT
  DATE_TRUNC('day', timestamp) as day,
  COUNT(*) as daily_count,
  SUM(value) as daily_sum,
  AVG(value) as daily_avg
FROM batch_data
WHERE timestamp >= CURRENT_DATE - INTERVAL '30' DAY
GROUP BY DATE_TRUNC('day', timestamp)
ORDER BY day;

-- 示例4：相关性分析（某些数据库支持）
-- 假设有列 value_a 和 value_b
SELECT
  CORR(value_a, value_b) as correlation
FROM batch_data;
`;
      }
    }
    return '';
  };

  // 初始化脚本内容
  useEffect(() => {
    if (!scriptContent || scriptContent.trim() === '') {
      setScriptContent(generateDefaultScript(scriptType, analysisType));
    }
  }, [scriptType, analysisType]);

  return (
    <div className="node-config-form">
      <div className="form-group">
        <label>分析类型</label>
        <select 
          value={analysisType} 
          onChange={(e) => setAnalysisType(e.target.value)}
          className="form-select"
        >
          <option value="batch">批量分析</option>
          <option value="realtime">实时分析</option>
        </select>
      </div>

      <div className="form-group">
        <label>输入数据源</label>
        <select 
          value={inputSource} 
          onChange={(e) => setInputSource(e.target.value)}
          className="form-select"
        >
          <option value="">选择数据源...</option>
          <option value="node">上游节点输出</option>
          <option value="database">数据库</option>
          <option value="api">API数据</option>
          <option value="file">文件数据</option>
          <option value="stream">数据流</option>
        </select>
      </div>

      <div className="form-group">
        <label>输出目标</label>
        <select 
          value={outputTarget} 
          onChange={(e) => setOutputTarget(e.target.value)}
          className="form-select"
        >
          <option value="">选择输出目标...</option>
          <option value="node">下游节点</option>
          <option value="database">存储到数据库</option>
          <option value="visualization">可视化节点</option>
          <option value="file">文件输出</option>
        </select>
      </div>

      <div className="form-group">
        <label>脚本类型</label>
        <select 
          value={scriptType} 
          onChange={(e) => setScriptType(e.target.value)}
          className="form-select"
        >
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
          <option value="sql">SQL</option>
        </select>
      </div>

      <div className="form-group">
        <label>脚本内容</label>
        <textarea 
          value={scriptContent} 
          onChange={(e) => setScriptContent(e.target.value)} 
          className="form-textarea code-editor"
          rows={12}
          placeholder={`在这里编写${scriptType}脚本...`}
        />
      </div>

      <div className="form-group">
        <button 
          onClick={() => setScriptContent(generateDefaultScript(scriptType, analysisType))}
          className="form-button secondary"
        >
          重置为默认脚本模板
        </button>
        <div className="form-hint">
          {analysisType === 'realtime' 
            ? '实时分析适用于处理连续的数据流，如传感器数据、日志或事件流' 
            : '批量分析适用于处理大规模历史数据集，进行数据挖掘和离线分析'}
        </div>
      </div>
    </div>
  );
};

// 触发器节点配置面板
const TriggerNodeConfig: React.FC<{
  node: Node;
  onUpdateNodeData: (nodeId: string, data: any) => void;
}> = ({ node, onUpdateNodeData }) => {
  const [subType, setSubType] = useState(node.data.subType || 'default');
  const [type, setType] = useState(node.data.config?.type || 'manual');
  const [schedule, setSchedule] = useState(node.data.config?.schedule || '0 0 * * *');
  const [description, setDescription] = useState(node.data.config?.description || '');

  // 更新节点数据
  const updateNodeData = () => {
    const newConfig = {
      type,
      schedule: type === 'scheduled' ? schedule : '',
      description
    };
    
    onUpdateNodeData(node.id, {
      ...node.data,
      config: newConfig
    });
  };

  // 检测配置变化时更新节点
  useEffect(() => {
    updateNodeData();
  }, [type, schedule, description]);

  return (
    <div className="node-config-form">
      <div className="form-group">
        <label>触发器类型</label>
        <select 
          value={type} 
          onChange={(e) => setType(e.target.value)}
          className="form-select"
        >
          <option value="manual">手动触发</option>
          <option value="scheduled">定时任务</option>
          <option value="webhook">Webhook</option>
          <option value="event">事件触发</option>
        </select>
      </div>

      {type === 'scheduled' && (
        <div className="form-group">
          <label>定时表达式 (Cron)</label>
          <input 
            type="text" 
            value={schedule} 
            onChange={(e) => setSchedule(e.target.value)} 
            placeholder="0 0 * * *"
            className="form-input"
          />
          <div className="form-hint">
            示例: "0 0 * * *" 表示每天午夜执行
          </div>
        </div>
      )}

      <div className="form-group">
        <label>描述</label>
        <textarea 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          placeholder="触发器描述信息..."
          className="form-textarea"
          rows={3}
        />
      </div>
    </div>
  );
};

// AI节点配置面板
const AINodeConfig: React.FC<{
  node: Node;
  onUpdateNodeData: (nodeId: string, data: any) => void;
}> = ({ node, onUpdateNodeData }) => {
  const [model, setModel] = useState(node.data.config?.model || 'gpt-3.5-turbo');
  const [prompt, setPrompt] = useState(node.data.config?.prompt || '');
  const [temperature, setTemperature] = useState(node.data.config?.temperature || 0.7);
  const [systemMessage, setSystemMessage] = useState(node.data.config?.systemMessage || '');

  // 更新节点数据
  const updateNodeData = () => {
    const newConfig = {
      model,
      prompt,
      temperature,
      systemMessage
    };
    
    onUpdateNodeData(node.id, {
      ...node.data,
      config: newConfig
    });
  };

  // 检测配置变化时更新节点
  useEffect(() => {
    updateNodeData();
  }, [model, prompt, temperature, systemMessage]);

  return (
    <div className="node-config-form">
      <div className="form-group">
        <label>AI模型</label>
        <select 
          value={model} 
          onChange={(e) => setModel(e.target.value)}
          className="form-select"
        >
          <option value="gpt-4">GPT-4</option>
          <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
          <option value="claude-3">Claude 3</option>
          <option value="llama-3">Llama 3</option>
          <option value="gemini-pro">Gemini Pro</option>
        </select>
      </div>

      <div className="form-group">
        <label>提示词</label>
        <textarea 
          value={prompt} 
          onChange={(e) => setPrompt(e.target.value)} 
          placeholder="输入AI模型提示词..."
          className="form-textarea"
          rows={4}
        />
      </div>

      <div className="form-group">
        <label>温度: {temperature}</label>
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.1" 
          value={temperature} 
          onChange={(e) => setTemperature(parseFloat(e.target.value))}
          className="form-range"
        />
        <div className="range-labels">
          <span>更确定</span>
          <span>更创造性</span>
        </div>
      </div>
      
      <div className="form-group">
        <label>系统消息</label>
        <textarea 
          value={systemMessage} 
          onChange={(e) => setSystemMessage(e.target.value)} 
          placeholder="可选的系统消息..."
          className="form-textarea"
          rows={3}
        />
      </div>
    </div>
  );
};

// 数据源节点配置面板
const DataSourceNodeConfig: React.FC<{
  node: Node;
  onUpdateNodeData: (nodeId: string, data: any) => void;
}> = ({ node, onUpdateNodeData }) => {
  const [source, setSource] = useState(node.data.config?.source || 'api');
  const [endpoint, setEndpoint] = useState(node.data.config?.endpoint || '');
  const [method, setMethod] = useState(node.data.config?.method || 'GET');
  const [query, setQuery] = useState(node.data.config?.query || '');
  const [refresh, setRefresh] = useState(node.data.config?.refresh || '5m');

  // 更新节点数据
  const updateNodeData = () => {
    const newConfig = {
      source,
      endpoint: source === 'api' ? endpoint : '',
      method: source === 'api' ? method : '',
      query: source === 'database' ? query : '',
      refresh
    };
    
    onUpdateNodeData(node.id, {
      ...node.data,
      config: newConfig
    });
  };

  // 检测配置变化时更新节点
  useEffect(() => {
    updateNodeData();
  }, [source, endpoint, method, query, refresh]);

  return (
    <div className="node-config-form">
      <div className="form-group">
        <label>数据源类型</label>
        <select 
          value={source} 
          onChange={(e) => setSource(e.target.value)}
          className="form-select"
        >
          <option value="api">API</option>
          <option value="database">数据库</option>
          <option value="file">文件</option>
        </select>
      </div>

      {source === 'api' && (
        <>
          <div className="form-group">
            <label>API端点</label>
            <input 
              type="text" 
              value={endpoint} 
              onChange={(e) => setEndpoint(e.target.value)} 
              placeholder="https://example.com/api"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>请求方法</label>
            <select 
              value={method} 
              onChange={(e) => setMethod(e.target.value)}
              className="form-select"
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
            </select>
          </div>
        </>
      )}

      {source === 'database' && (
        <div className="form-group">
          <label>SQL查询</label>
          <textarea 
            value={query} 
            onChange={(e) => setQuery(e.target.value)} 
            placeholder="SELECT * FROM table"
            className="form-textarea"
            rows={3}
          />
        </div>
      )}

      <div className="form-group">
        <label>刷新间隔</label>
        <input 
          type="text" 
          value={refresh} 
          onChange={(e) => setRefresh(e.target.value)} 
          placeholder="5m"
          className="form-input"
        />
        <div className="form-hint">
          格式: 30s, 5m, 1h 等
        </div>
      </div>
    </div>
  );
};

// 条件节点配置面板
const ConditionNodeConfig: React.FC<{
  node: Node;
  onUpdateNodeData: (nodeId: string, data: any) => void;
}> = ({ node, onUpdateNodeData }) => {
  const [condition, setCondition] = useState(node.data.config?.condition || '');
  const [description, setDescription] = useState(node.data.config?.description || '');
  const [trueLabel, setTrueLabel] = useState(node.data.config?.trueLabel || '是');
  const [falseLabel, setFalseLabel] = useState(node.data.config?.falseLabel || '否');

  // 更新节点数据
  const updateNodeData = () => {
    const newConfig = {
      condition,
      description,
      trueLabel,
      falseLabel
    };
    
    onUpdateNodeData(node.id, {
      ...node.data,
      config: newConfig
    });
  };

  // 检测配置变化时更新节点
  useEffect(() => {
    updateNodeData();
  }, [condition, description, trueLabel, falseLabel]);

  return (
    <div className="node-config-form">
      <div className="form-group">
        <label>条件表达式</label>
        <textarea 
          value={condition} 
          onChange={(e) => setCondition(e.target.value)} 
          placeholder="data.value > 10"
          className="form-textarea"
          rows={3}
        />
      </div>

      <div className="form-group">
        <label>描述</label>
        <textarea 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          placeholder="条件说明..."
          className="form-textarea"
          rows={2}
        />
      </div>

      <div className="form-group-split">
        <div className="form-group">
          <label>满足条件标签</label>
          <input 
            type="text" 
            value={trueLabel} 
            onChange={(e) => setTrueLabel(e.target.value)} 
            placeholder="是"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label>不满足条件标签</label>
          <input 
            type="text" 
            value={falseLabel} 
            onChange={(e) => setFalseLabel(e.target.value)} 
            placeholder="否"
            className="form-input"
          />
        </div>
      </div>
    </div>
  );
};

// 输出节点配置面板
const OutputNodeConfig: React.FC<{
  node: Node;
  onUpdateNodeData: (nodeId: string, data: any) => void;
}> = ({ node, onUpdateNodeData }) => {
  const [format, setFormat] = useState(node.data.config?.format || 'message');
  const [description, setDescription] = useState(node.data.config?.description || '');
  const [channel, setChannel] = useState(node.data.config?.channel || 'email');

  // 更新节点数据
  const updateNodeData = () => {
    const newConfig = {
      format,
      description,
      channel: format === 'message' ? channel : ''
    };
    
    onUpdateNodeData(node.id, {
      ...node.data,
      config: newConfig
    });
  };

  // 检测配置变化时更新节点
  useEffect(() => {
    updateNodeData();
  }, [format, description, channel]);

  return (
    <div className="node-config-form">
      <div className="form-group">
        <label>输出格式</label>
        <select 
          value={format} 
          onChange={(e) => setFormat(e.target.value)}
          className="form-select"
        >
          <option value="message">消息</option>
          <option value="document">文档</option>
          <option value="json">JSON</option>
          <option value="csv">CSV</option>
        </select>
      </div>

      <div className="form-group">
        <label>描述</label>
        <textarea 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          placeholder="输出说明..."
          className="form-textarea"
          rows={3}
        />
      </div>

      {format === 'message' && (
        <div className="form-group">
          <label>通知渠道</label>
          <select 
            value={channel} 
            onChange={(e) => setChannel(e.target.value)}
            className="form-select"
          >
            <option value="email">电子邮件</option>
            <option value="sms">短信</option>
            <option value="webhook">Webhook</option>
            <option value="slack">Slack</option>
          </select>
        </div>
      )}
    </div>
  );
};

// 主配置面板组件
const NodeConfigPanel: React.FC<NodeConfigPanelProps> = ({
  node,
  onClose,
  onUpdateNodeData,
}) => {
  // 如果没有选中节点，显示空面板
  if (!node) {
    return (
      <div className="node-config-panel">
        <div className="node-config-panel-header">
          <h3>节点配置</h3>
          <button className="close-button" onClick={onClose}>
            <FiX />
          </button>
        </div>
        <div className="node-config-panel-content">
          <p>请选择一个节点进行配置</p>
        </div>
      </div>
    );
  }

  // 根据节点类型渲染不同的配置面板
  const renderConfigPanel = () => {
    console.log('渲染配置面板，节点类型：', node.type, '节点数据：', node.data);
    
    switch (node.type) {
      case 'visualizationNode':
        return <VisualizationNodeConfig node={node} onUpdateNodeData={onUpdateNodeData} />;
      case 'analysisNode':
        return <AnalysisNodeConfig node={node} onUpdateNodeData={onUpdateNodeData} />;
      case 'aiNode':
        return <AINodeConfig node={node} onUpdateNodeData={onUpdateNodeData} />;
      case 'dataSourceNode':
        return <DataSourceNodeConfig node={node} onUpdateNodeData={onUpdateNodeData} />;
      case 'triggerNode':
        return <TriggerNodeConfig node={node} onUpdateNodeData={onUpdateNodeData} />;
      case 'conditionNode':
        return <ConditionNodeConfig node={node} onUpdateNodeData={onUpdateNodeData} />;
      case 'outputNode':
        return <OutputNodeConfig node={node} onUpdateNodeData={onUpdateNodeData} />;
      default:
        return (
          <div className="node-config-panel-content">
            <p>此节点类型暂不支持配置</p>
            <pre>节点类型: {node.type}</pre>
            <pre>节点数据: {JSON.stringify(node.data, null, 2)}</pre>
          </div>
        );
    }
  };

  // 获取节点标题
  const getNodeTitle = () => {
    switch (node.type) {
      case 'visualizationNode':
        return node.data.subType === 'dashboard' ? '动态仪表盘配置' : '图表节点配置';
      case 'analysisNode':
        return node.data.subType === 'realtime' ? '实时分析配置' : '批量分析配置';
      case 'aiNode':
        return node.data.subType === 'chat' ? '智能对话配置' : '内容生成配置';
      case 'dataSourceNode':
        return node.data.subType === 'database' ? '数据库配置' : 'API 数据源配置';
      case 'triggerNode':
        return node.data.subType === 'schedule' ? '定时触发配置' : '触发器配置';
      case 'conditionNode':
        return '条件节点配置';
      case 'outputNode':
        return node.data.subType === 'document' ? '文档输出配置' : '消息输出配置';
      default:
        return `节点配置 (${node.type})`;
    }
  };

  return (
    <div className="node-config-panel">
      <div className="node-config-panel-header">
        <h3>{getNodeTitle()}</h3>
        <button className="close-button" onClick={onClose}>
          <FiX />
        </button>
      </div>
      <div className="node-config-panel-content">
        {renderConfigPanel()}
      </div>
      <style>{configPanelStyles}</style>
    </div>
  );
};

export default NodeConfigPanel;
