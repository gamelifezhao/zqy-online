'use client';

import React, { useState } from 'react';
import './Sidebar.css';
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
  FiMessageCircle,
  FiServer,
  FiPieChart,
  FiActivity,
  FiLayers
} from 'react-icons/fi';

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState('nodes');
  const [searchTerm, setSearchTerm] = useState('');

  // 处理拖拽开始
  const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: string, nodeSubType: string = '') => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.setData('nodeSubType', nodeSubType);
    event.dataTransfer.effectAllowed = 'move';
    
    // 鼠标样式优化
    const ghostImage = document.createElement('div');
    ghostImage.className = 'ghost-drag-image';
    ghostImage.style.width = '150px';
    ghostImage.style.height = '60px';
    ghostImage.style.backgroundColor = 'rgba(99, 102, 241, 0.1)';
    ghostImage.style.border = '2px dashed #6366f1';
    ghostImage.style.borderRadius = '8px';
    ghostImage.style.display = 'flex';
    ghostImage.style.alignItems = 'center';
    ghostImage.style.justifyContent = 'center';
    ghostImage.style.color = '#6366f1';
    ghostImage.style.fontWeight = 'bold';
    ghostImage.innerHTML = `<span>${getNodeLabel(nodeType, nodeSubType)}</span>`;
    document.body.appendChild(ghostImage);
    
    // 设置拖拽图像，并定位到鼠标位置附近
    event.dataTransfer.setDragImage(ghostImage, 75, 30);
    
    // 在拖拽结束后移除临时元素
    setTimeout(() => {
      document.body.removeChild(ghostImage);
    }, 0);
  };
  
  // 获取节点标签
  const getNodeLabel = (nodeType: string, nodeSubType: string): string => {
    switch (nodeType) {
      case 'triggerNode':
        return nodeSubType === 'schedule' ? '定时触发器' : '默认触发器';
      case 'aiNode':
        return nodeSubType === 'chat' ? '聊天节点' : '文本生成';
      case 'conditionNode':
        return 'IF 条件';
      case 'dataSourceNode':
        return nodeSubType === 'database' ? '数据库' : 'API 数据源';
      case 'visualizationNode':
        return nodeSubType === 'dashboard' ? '动态仪表盘' : '图表节点';
      case 'analysisNode':
        return nodeSubType === 'realtime' ? '实时分析' : '批量分析';
      case 'outputNode':
        return nodeSubType === 'document' ? '文档生成' : '消息输出';
      default:
        return '未命名节点';
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h3>组件</h3>
      </div>
      
      <div className="sidebar-search">
        <input 
          type="text" 
          placeholder="搜索组件..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="sidebar-tabs">
        <div 
          className={`sidebar-tab ${activeTab === 'nodes' ? 'active' : ''}`}
          onClick={() => setActiveTab('nodes')}
        >
          组件
        </div>
        <div 
          className={`sidebar-tab ${activeTab === 'templates' ? 'active' : ''}`}
          onClick={() => setActiveTab('templates')}
        >
          模板
        </div>
      </div>
      
      {activeTab === 'nodes' && (
        <div className="nodes-container">
          <div className="nodes-category">
            <div className="nodes-category-title">触发器</div>
            <div
              className="dndnode trigger"
              onDragStart={(event) => onDragStart(event, 'triggerNode', 'default')}
              draggable
            >
              <div className="node-icon">
                <FiBell />
              </div>
              <div className="node-content">
                <div className="node-title">默认触发器</div>
                <div className="node-description">开始工作流执行</div>
              </div>
            </div>
            <div
              className="dndnode trigger"
              onDragStart={(event) => onDragStart(event, 'triggerNode', 'schedule')}
              draggable
            >
              <div className="node-icon">
                <FiBell />
              </div>
              <div className="node-content">
                <div className="node-title">定时触发器</div>
                <div className="node-description">按计划启动工作流</div>
              </div>
            </div>
          </div>

          <div className="nodes-category">
            <div className="nodes-category-title">AI 组件</div>
            <div
              className="dndnode ai"
              onDragStart={(event) => onDragStart(event, 'aiNode', 'completion')}
              draggable
            >
              <div className="node-icon">
                <FiCpu />
              </div>
              <div className="node-content">
                <div className="node-title">文本生成</div>
                <div className="node-description">生成文本内容</div>
              </div>
            </div>
            <div
              className="dndnode ai"
              onDragStart={(event) => onDragStart(event, 'aiNode', 'chat')}
              draggable
            >
              <div className="node-icon">
                <FiMessageCircle />
              </div>
              <div className="node-content">
                <div className="node-title">聊天节点</div>
                <div className="node-description">进行多轮对话</div>
              </div>
            </div>
          </div>

          <div className="nodes-category">
            <div className="nodes-category-title">流程控制</div>
            <div
              className="dndnode condition"
              onDragStart={(event) => onDragStart(event, 'conditionNode', '')}
              draggable
            >
              <div className="node-icon">
                <FiGitBranch />
              </div>
              <div className="node-content">
                <div className="node-title">条件节点</div>
                <div className="node-description">基于条件路由流程</div>
              </div>
            </div>
          </div>

          <div className="nodes-category">
            <div className="nodes-category-title">数据源</div>
            <div
              className="dndnode datasource"
              onDragStart={(event) => onDragStart(event, 'dataSourceNode', 'database')}
              draggable
            >
              <div className="node-icon">
                <FiDatabase />
              </div>
              <div className="node-content">
                <div className="node-title">数据库源</div>
                <div className="node-description">连接到数据库</div>
              </div>
            </div>
            <div
              className="dndnode datasource"
              onDragStart={(event) => onDragStart(event, 'dataSourceNode', 'api')}
              draggable
            >
              <div className="node-icon">
                <FiServer />
              </div>
              <div className="node-content">
                <div className="node-title">API 数据源</div>
                <div className="node-description">调用外部API</div>
              </div>
            </div>
          </div>

          <div className="nodes-category">
            <div className="nodes-category-title">数据可视化</div>
            <div
              className="dndnode visualization"
              onDragStart={(event) => onDragStart(event, 'visualizationNode', 'chart')}
              draggable
            >
              <div className="node-icon">
                <FiPieChart />
              </div>
              <div className="node-content">
                <div className="node-title">图表节点</div>
                <div className="node-description">可视化数据图表</div>
              </div>
            </div>
            <div
              className="dndnode visualization"
              onDragStart={(event) => onDragStart(event, 'visualizationNode', 'dashboard')}
              draggable
            >
              <div className="node-icon">
                <FiGrid />
              </div>
              <div className="node-content">
                <div className="node-title">动态仪表盘</div>
                <div className="node-description">多图表仪表盘</div>
              </div>
            </div>
          </div>

          <div className="nodes-category">
            <div className="nodes-category-title">数据分析</div>
            <div
              className="dndnode analysis"
              onDragStart={(event) => onDragStart(event, 'analysisNode', 'realtime')}
              draggable
            >
              <div className="node-icon">
                <FiActivity />
              </div>
              <div className="node-content">
                <div className="node-title">实时分析</div>
                <div className="node-description">实时处理数据流</div>
              </div>
            </div>
            <div
              className="dndnode analysis"
              onDragStart={(event) => onDragStart(event, 'analysisNode', 'batch')}
              draggable
            >
              <div className="node-icon">
                <FiLayers />
              </div>
              <div className="node-content">
                <div className="node-title">批量分析</div>
                <div className="node-description">批处理大数据</div>
              </div>
            </div>
          </div>

          <div className="nodes-category">
            <div className="nodes-category-title">输出</div>
            <div
              className="dndnode output"
              onDragStart={(event) => onDragStart(event, 'outputNode', 'message')}
              draggable
            >
              <div className="node-icon">
                <FiSend />
              </div>
              <div className="node-content">
                <div className="node-title">消息输出</div>
                <div className="node-description">发送消息通知</div>
              </div>
            </div>
            <div
              className="dndnode output"
              onDragStart={(event) => onDragStart(event, 'outputNode', 'document')}
              draggable
            >
              <div className="node-icon">
                <FiFileText />
              </div>
              <div className="node-content">
                <div className="node-title">文档生成</div>
                <div className="node-description">生成文档报告</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'templates' && (
        <div className="templates-section">
          <div className="templates-list">
            <div className="template-item">
              <div className="template-title">智能客服系统</div>
              <div className="template-description">自动回答客户问题并处理请求</div>
            </div>
            <div className="template-item">
              <div className="template-title">动态数据仪表板</div>
              <div className="template-description">实时显示数据指标和可视化</div>
            </div>
            <div className="template-item">
              <div className="template-title">自动化文档生成</div>
              <div className="template-description">基于数据自动生成报告</div>
            </div>
            <div className="template-item">
              <div className="template-title">实时数据分析管道</div>
              <div className="template-description">连续处理和分析数据流</div>
            </div>
          </div>
        </div>
      )}

      <div className="help-section">
        <h3>使用帮助</h3>
        <ul>
          <li>拖放组件到画布上创建工作流</li>
          <li>连接节点以定义数据流向</li>
          <li>配置每个节点的参数</li>
          <li>验证和部署您的工作流</li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
