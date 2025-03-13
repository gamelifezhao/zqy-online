'use client';

import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  useReactFlow,
  Node,
  Edge,
  Connection,
  Position,
  NodeTypes,
  ConnectionLineType,
  MarkerType,
  Panel
} from 'reactflow';
import 'reactflow/dist/style.css';
import { 
  FiSave, 
  FiZoomIn, 
  FiZoomOut, 
  FiMaximize2, 
  FiMinimize2, 
  FiRefreshCw,
  FiCornerUpLeft,
  FiCornerUpRight,
  FiDownload,
  FiImage,
  FiCheck,
  FiUpload,
  FiBarChart2,
  FiTrendingUp,
  FiPieChart,
  FiActivity,
  FiLayers,
  FiGitBranch
} from 'react-icons/fi';
import { saveAs } from 'file-saver';

// 使用索引文件导入所有组件
import { 
  Sidebar, 
  NodeConfigPanel, 
  VisualizationNode, 
  AnalysisNode, 
  AINode, 
  TriggerNode, 
  ConditionNode, 
  DataSourceNode, 
  OutputNode,
  CustomEdge,
  ChartPreview 
} from './';

// 导入 CSS
import '../workflow-editor.css';

// 定义节点类型
const nodeTypes: NodeTypes = {
  aiNode: AINode,
  conditionNode: ConditionNode,
  dataSourceNode: DataSourceNode,
  outputNode: OutputNode,
  triggerNode: TriggerNode,
  visualizationNode: VisualizationNode,
  analysisNode: AnalysisNode,
};

// 定义边类型
const edgeTypes = {
  custom: CustomEdge,
};

// 初始节点
const initialNodes: Node[] = [
  {
    id: '1',
    type: 'triggerNode',
    position: { x: 250, y: 50 },
    data: { 
      label: '触发器', 
      config: { 
        type: 'manual',
        description: '手动触发工作流'
      } 
    },
  },
];

// 初始边
const initialEdges: Edge[] = [];

const flowKey = 'dify-workflow';

const WorkflowEditor = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
  const [connectionLineStyle, setConnectionLineStyle] = useState<string>('bezier');
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [historyStack, setHistoryStack] = useState<any[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [showPreviewPanel, setShowPreviewPanel] = useState<boolean>(false);
  const [previewPanelPosition, setPreviewPanelPosition] = useState<'right' | 'bottom'>('right');
  const [previewChartType, setPreviewChartType] = useState<'bar' | 'line' | 'pie' | 'scatter' | 'area' | 'radar'>('bar');
  const [previewChartData, setPreviewChartData] = useState<any>(null);
  const [isPreviewPanelMaximized, setIsPreviewPanelMaximized] = useState<boolean>(false);
  const { getNodes, getEdges, setViewport, fitView } = useReactFlow();

  // 根据节点类型获取节点标签
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

  // 更新历史记录
  const updateHistory = (newState: { nodes: Node[]; edges: Edge[] }) => {
    // 只保留当前步骤之前的历史记录
    const newStack = historyStack.slice(0, historyIndex + 1);
    // 添加新的状态到历史记录
    newStack.push(newState);
    // 更新历史记录堆栈
    setHistoryStack(newStack);
    // 更新当前历史记录索引
    setHistoryIndex(newStack.length - 1);
  };

  // 保存当前状态到历史记录
  const saveToHistory = useCallback(() => {
    const currentState = {
      nodes,
      edges
    };
    updateHistory(currentState);
  }, [nodes, edges, historyIndex, historyStack]);

  // 撤销功能
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const prevState = historyStack[historyIndex - 1];
      setNodes(prevState.nodes);
      setEdges(prevState.edges);
      setHistoryIndex(prev => prev - 1);
    }
  }, [historyIndex, historyStack, setNodes, setEdges]);

  // 重做功能
  const redo = useCallback(() => {
    if (historyIndex < historyStack.length - 1) {
      const nextState = historyStack[historyIndex + 1];
      setNodes(nextState.nodes);
      setEdges(nextState.edges);
      setHistoryIndex(prev => prev + 1);
    }
  }, [historyIndex, historyStack, setNodes, setEdges]);

  // 初始化历史
  useEffect(() => {
    if (historyStack.length === 0) {
      saveToHistory();
    }
  }, [historyStack.length, saveToHistory]);

  // 连接线样式映射
  const connectionLineStyleMap: Record<string, ConnectionLineType> = {
    'bezier': ConnectionLineType.Bezier,
    'straight': ConnectionLineType.Straight,
    'step': ConnectionLineType.SmoothStep,
    'simplebezier': ConnectionLineType.SimpleBezier,
  };

  // 节点连接处理
  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge = {
        ...params,
        type: 'custom',
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
          color: '#1a73e8',
        },
        style: {
          strokeWidth: 2,
          stroke: '#1a73e8',
        },
        data: {
          label: '连接',
          edgeType: connectionLineStyle,
        },
      };
      
      setEdges((eds) => addEdge(newEdge, eds));
      setTimeout(() => saveToHistory(), 0);
    },
    [setEdges, connectionLineStyle, saveToHistory]
  );

  // 拖拽完成处理
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // 放置处理
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      const nodeType = event.dataTransfer.getData('application/reactflow');
      const nodeSubType = event.dataTransfer.getData('nodeSubType') || '';
      
      if (!nodeType || !reactFlowBounds || !reactFlowInstance) {
        return;
      }

      console.log('拖放节点类型:', nodeType, '子类型:', nodeSubType);

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      // 生成唯一ID
      const id = `${nodeType}_${Date.now()}`;

      // 根据节点类型设置不同的配置
      let nodeConfig = {};
      
      // 可视化节点的默认配置
      if (nodeType === 'visualizationNode') {
        nodeConfig = {
          chartType: nodeSubType === 'dashboard' ? 'multiple' : 'bar',
          dataSource: '',
          refreshInterval: 60,
          chartTitle: nodeSubType === 'dashboard' ? '动态仪表盘' : '数据可视化',
          chartTheme: 'light',
          sampleData: JSON.stringify({
            labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
            datasets: [
              {
                label: '数据集A',
                data: [65, 59, 80, 81, 56, 55],
                backgroundColor: 'rgba(99, 102, 241, 0.6)',
              }
            ]
          }, null, 2)
        };
      }
      
      // 分析节点的默认配置
      if (nodeType === 'analysisNode') {
        nodeConfig = {
          analysisType: nodeSubType === 'realtime' ? 'realtime' : 'batch',
          inputSource: '',
          outputTarget: '',
          scriptType: 'python',
          scriptContent: `# ${nodeSubType === 'realtime' ? '实时数据分析' : '批量数据分析'}脚本示例\n\ndef process_data(data):\n    # 处理数据的逻辑\n    result = data\n    # 在这里添加处理逻辑\n    return result`
        };
      }
      
      // AI节点配置
      if (nodeType === 'aiNode') {
        nodeConfig = {
          model: 'gpt-3.5-turbo',
          prompt: '请提供指令...',
          temperature: 0.7,
          systemMessage: nodeSubType === 'chat' ? '你是一个智能助手，可以回答用户的问题。' : ''
        };
      }
      
      // 数据源节点配置
      if (nodeType === 'dataSourceNode') {
        nodeConfig = {
          source: nodeSubType === 'database' ? 'database' : 'api',
          query: nodeSubType === 'database' ? 'SELECT * FROM table' : '',
          endpoint: nodeSubType === 'api' ? 'https://api.example.com/data' : '',
          method: 'GET',
          refresh: '5m'
        };
      }
      
      // 触发器节点配置
      if (nodeType === 'triggerNode') {
        nodeConfig = {
          type: nodeSubType === 'schedule' ? 'scheduled' : 'manual',
          schedule: nodeSubType === 'schedule' ? '0 0 * * *' : '',
          description: nodeSubType === 'schedule' ? '定时任务' : '手动触发任务'
        };
      }
      
      // 条件节点配置
      if (nodeType === 'conditionNode') {
        nodeConfig = {
          condition: 'data.value > 10',
          description: '检查数据值是否大于10',
          trueLabel: '是',
          falseLabel: '否'
        };
      }
      
      // 输出节点配置
      if (nodeType === 'outputNode') {
        nodeConfig = {
          format: nodeSubType === 'document' ? 'document' : 'message',
          description: nodeSubType === 'document' ? '生成文档' : '发送消息',
          channel: nodeSubType === 'message' ? 'email' : ''
        };
      }

      // 创建新节点
      const newNode = {
        id,
        type: nodeType,
        position,
        data: { 
          label: getNodeLabel(nodeType, nodeSubType),
          subType: nodeSubType,
          config: nodeConfig
        },
      };

      // 使用setNodes更新节点，而不是直接操作reactFlowInstance
      setNodes((nds) => nds.concat(newNode));
      
      // 更新历史记录
      setTimeout(() => saveToHistory(), 0);
      
      // 将新添加的节点设为选中状态
      setSelectedNode(newNode);
    },
    [reactFlowInstance, setNodes, saveToHistory, getNodeLabel]
  );

  // 节点点击处理
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
    setSelectedEdge(null);
    
    // 如果选中的是可视化节点，显示图表预览
    if (node.type === 'visualizationNode') {
      setShowPreviewPanel(true);
      
      // 设置图表类型
      if (node.data?.config?.chartType) {
        setPreviewChartType(node.data.config.chartType);
      }
      
      // 设置图表数据
      if (node.data?.config?.sampleData) {
        try {
          const parsedData = JSON.parse(node.data.config.sampleData);
          setPreviewChartData(parsedData);
        } catch (err) {
          console.error('无法解析图表数据:', err);
          setPreviewChartData(null);
        }
      } else {
        setPreviewChartData(null);
      }
    }
  }, []);

  // 边点击处理
  const onEdgeClick = useCallback((_: React.MouseEvent, edge: Edge) => {
    setSelectedEdge(edge);
    setSelectedNode(null);
  }, []);

  // 背景点击处理
  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
    setSelectedEdge(null);
  }, []);

  // 更新节点配置
  const updateNodeConfig = useCallback((nodeId: string, config: any) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              config,
            },
          };
        }
        return node;
      })
    );
    setTimeout(() => saveToHistory(), 0);
  }, [setNodes, saveToHistory]);

  // 更新边配置
  const updateEdgeConfig = useCallback((edgeId: string, data: any) => {
    setEdges((eds) =>
      eds.map((edge) => {
        if (edge.id === edgeId) {
          return {
            ...edge,
            data: {
              ...edge.data,
              ...data,
            },
          };
        }
        return edge;
      })
    );
    setTimeout(() => saveToHistory(), 0);
  }, [setEdges, saveToHistory]);

  // 删除节点
  const onNodesDelete = useCallback(
    (deleted: Node[]) => {
      setTimeout(() => saveToHistory(), 0);
    },
    [saveToHistory]
  );

  // 删除边
  const onEdgesDelete = useCallback(
    (deleted: Edge[]) => {
      setTimeout(() => saveToHistory(), 0);
    },
    [saveToHistory]
  );

  // 更改连接线样式
  const onChangeConnectionLineStyle = useCallback((style: string) => {
    setConnectionLineStyle(style);
  }, []);

  // 保存工作流
  const onSave = useCallback(() => {
    if (reactFlowInstance) {
      const flow = reactFlowInstance.toObject();
      localStorage.setItem(flowKey, JSON.stringify(flow));
    }
  }, [reactFlowInstance]);

  // 恢复工作流
  const onRestore = useCallback(() => {
    const restoreFlow = async () => {
      const flow = JSON.parse(localStorage.getItem(flowKey) || '{}');

      if (flow.nodes && flow.edges) {
        setNodes(flow.nodes || []);
        setEdges(flow.edges || []);
        setViewport(flow.viewport || { x: 0, y: 0, zoom: 1 });
      }
    };

    restoreFlow();
  }, [setNodes, setEdges, setViewport]);

  // 导出为JSON
  const exportJSON = useCallback(() => {
    if (reactFlowInstance) {
      const flow = reactFlowInstance.toObject();
      const json = JSON.stringify(flow, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      saveAs(blob, 'workflow.json');
    }
  }, [reactFlowInstance]);

  // 导入JSON
  const importJSON = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    const files = event.target.files;
    
    if (files && files.length > 0) {
      fileReader.readAsText(files[0], 'UTF-8');
      fileReader.onload = (e) => {
        const content = e.target?.result as string;
        try {
          const flow = JSON.parse(content);
          if (flow.nodes && flow.edges) {
            setNodes(flow.nodes);
            setEdges(flow.edges);
            setViewport(flow.viewport || { x: 0, y: 0, zoom: 1 });
            setTimeout(() => fitView(), 50);
          }
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      };
    }
  }, [setNodes, setEdges, setViewport, fitView]);

  // 导出为图片
  const exportImage = useCallback(() => {
    if (reactFlowWrapper.current) {
      html2canvas(reactFlowWrapper.current).then((canvas) => {
        canvas.toBlob((blob) => {
          if (blob) {
            saveAs(blob, 'workflow.png');
          }
        });
      });
    }
  }, []);

  // 验证工作流
  const validateWorkflow = useCallback(() => {
    setIsValidating(true);
    setValidationErrors([]);
    
    const errors: string[] = [];
    const currentNodes = getNodes();
    const currentEdges = getEdges();
    
    // 检查是否有触发器节点
    const hasTrigger = currentNodes.some(node => node.type === 'triggerNode');
    if (!hasTrigger) {
      errors.push('工作流必须包含至少一个触发器节点');
    }
    
    // 检查是否有输出节点
    const hasOutput = currentNodes.some(node => node.type === 'outputNode');
    if (!hasOutput) {
      errors.push('工作流必须包含至少一个输出节点');
    }
    
    // 检查是否有孤立节点（没有连接的节点）
    const connectedNodeIds = new Set<string>();
    
    currentEdges.forEach(edge => {
      connectedNodeIds.add(edge.source);
      connectedNodeIds.add(edge.target);
    });
    
    const isolatedNodes = currentNodes.filter(node => !connectedNodeIds.has(node.id));
    if (isolatedNodes.length > 0) {
      errors.push(`存在 ${isolatedNodes.length} 个孤立节点，请连接或删除它们`);
    }
    
    // 检查每个节点的配置是否完整
    currentNodes.forEach(node => {
      if (!node.data.config || Object.keys(node.data.config).length === 0) {
        errors.push(`节点 "${node.data.label}" (${node.id}) 未配置参数`);
      }
    });
    
    setValidationErrors(errors);
    setIsValidating(false);
    
    return errors.length === 0;
  }, [getNodes, getEdges]);

  const generateTemplateWorkflow = useCallback((templateName: string) => {
    let templateNodes: Node[] = [];
    let templateEdges: Edge[] = [];

    switch (templateName) {
      case 'simple-qa':
        templateNodes = [
          {
            id: 'trigger1',
            type: 'triggerNode',
            position: { x: 250, y: 50 },
            data: { 
              label: '用户输入', 
              config: { 
                type: 'userInput',
                description: '接收用户问题'
              } 
            },
          },
          {
            id: 'ai1',
            type: 'aiNode',
            position: { x: 250, y: 150 },
            data: { 
              label: 'AI处理', 
              config: { 
                model: 'gpt-4',
                prompt: '回答用户问题',
                temperature: 0.7
              } 
            },
          },
          {
            id: 'output1',
            type: 'outputNode',
            position: { x: 250, y: 250 },
            data: { 
              label: '回复用户', 
              config: { 
                format: 'text',
                description: '将AI回答展示给用户'
              } 
            },
          },
        ];
        templateEdges = [
          {
            id: 'e1-2',
            source: 'trigger1',
            target: 'ai1',
            type: 'custom',
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 20,
              height: 20,
              color: '#1a73e8',
            },
            style: {
              strokeWidth: 2,
              stroke: '#1a73e8',
            },
            data: {
              label: '传递问题',
              edgeType: 'bezier',
            },
          },
          {
            id: 'e2-3',
            source: 'ai1',
            target: 'output1',
            type: 'custom',
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 20,
              height: 20,
              color: '#1a73e8',
            },
            style: {
              strokeWidth: 2,
              stroke: '#1a73e8',
            },
            data: {
              label: '传递回答',
              edgeType: 'bezier',
            },
          },
        ];
        break;

      case 'data-analysis':
        templateNodes = [
          {
            id: 'trigger1',
            type: 'triggerNode',
            position: { x: 250, y: 50 },
            data: { 
              label: '数据源触发', 
              config: { 
                type: 'dataSource',
                description: '监控数据变化'
              } 
            },
          },
          {
            id: 'datasource1',
            type: 'dataSourceNode',
            position: { x: 250, y: 150 },
            data: { 
              label: '读取数据', 
              config: { 
                source: 'database',
                query: 'SELECT * FROM data',
                refresh: '5m'
              } 
            },
          },
          {
            id: 'ai1',
            type: 'aiNode',
            position: { x: 250, y: 250 },
            data: { 
              label: 'AI分析', 
              config: { 
                model: 'gpt-4',
                prompt: '分析数据趋势',
                temperature: 0.3
              } 
            },
          },
          {
            id: 'condition1',
            type: 'conditionNode',
            position: { x: 250, y: 350 },
            data: { 
              label: '检查结果', 
              config: { 
                condition: '结果.置信度 > 0.8',
                description: '检查分析结果可信度'
              } 
            },
          },
          {
            id: 'output1',
            type: 'outputNode',
            position: { x: 100, y: 450 },
            data: { 
              label: '发送警报', 
              config: { 
                format: 'notification',
                channel: 'email',
                recipient: 'admin@example.com'
              } 
            },
          },
          {
            id: 'output2',
            type: 'outputNode',
            position: { x: 400, y: 450 },
            data: { 
              label: '保存结果', 
              config: { 
                format: 'database',
                table: 'analysis_results',
                description: '将分析结果保存到数据库'
              } 
            },
          },
        ];
        templateEdges = [
          {
            id: 'e1-2',
            source: 'trigger1',
            target: 'datasource1',
            type: 'custom',
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 20,
              height: 20,
              color: '#1a73e8',
            },
            style: {
              strokeWidth: 2,
              stroke: '#1a73e8',
            },
            data: {
              label: '触发读取',
              edgeType: 'bezier',
            },
          },
          {
            id: 'e2-3',
            source: 'datasource1',
            target: 'ai1',
            type: 'custom',
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 20,
              height: 20,
              color: '#1a73e8',
            },
            style: {
              strokeWidth: 2,
              stroke: '#1a73e8',
            },
            data: {
              label: '传递数据',
              edgeType: 'bezier',
            },
          },
          {
            id: 'e3-4',
            source: 'ai1',
            target: 'condition1',
            type: 'custom',
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 20,
              height: 20,
              color: '#1a73e8',
            },
            style: {
              strokeWidth: 2,
              stroke: '#1a73e8',
            },
            data: {
              label: '传递分析结果',
              edgeType: 'bezier',
            },
          },
          {
            id: 'e4-5',
            source: 'condition1',
            target: 'output1',
            type: 'custom',
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 20,
              height: 20,
              color: '#1a73e8',
            },
            style: {
              strokeWidth: 2,
              stroke: '#1a73e8',
            },
            data: {
              label: '异常情况',
              edgeType: 'bezier',
            },
            sourceHandle: 'false',
          },
          {
            id: 'e4-6',
            source: 'condition1',
            target: 'output2',
            type: 'custom',
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 20,
              height: 20,
              color: '#1a73e8',
            },
            style: {
              strokeWidth: 2,
              stroke: '#1a73e8',
            },
            data: {
              label: '正常情况',
              edgeType: 'bezier',
            },
            sourceHandle: 'true',
          },
        ];
        break;
    }

    if (templateNodes.length > 0) {
      setNodes(templateNodes);
      setEdges(templateEdges);
      setTimeout(() => {
        fitView();
        saveToHistory();
      }, 50);
    }
  }, [setNodes, setEdges, fitView, saveToHistory]);

  // 渲染预览面板
  const renderPreviewPanel = () => {
    if (!showPreviewPanel) return null;
    
    const panelStyle: React.CSSProperties = {
      position: 'absolute',
      backgroundColor: 'white',
      borderRadius: '6px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      zIndex: 10,
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      transition: 'all 0.3s ease',
      ...(isPreviewPanelMaximized
        ? {
            top: '70px',
            left: '250px',
            right: '16px',
            bottom: '16px',
          }
        : previewPanelPosition === 'right'
        ? {
            top: '70px',
            right: '16px',
            width: '400px',
            maxHeight: 'calc(100vh - 100px)',
          }
        : {
            bottom: '16px',
            left: '250px',
            right: '16px',
            height: '300px',
          }),
    };
    
    const headerStyle: React.CSSProperties = {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '12px',
    };
    
    const buttonStyle: React.CSSProperties = {
      border: 'none',
      background: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '32px',
      height: '32px',
      borderRadius: '4px',
    };
    
    return (
      <div style={panelStyle}>
        <div style={headerStyle}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>数据可视化预览</h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              style={buttonStyle}
              onClick={() => setPreviewPanelPosition(previewPanelPosition === 'right' ? 'bottom' : 'right')}
              title={previewPanelPosition === 'right' ? '移至底部' : '移至右侧'}
            >
              {previewPanelPosition === 'right' ? '⤓' : '⤒'}
            </button>
            <button
              style={buttonStyle}
              onClick={() => setIsPreviewPanelMaximized(!isPreviewPanelMaximized)}
              title={isPreviewPanelMaximized ? '最小化' : '最大化'}
            >
              {isPreviewPanelMaximized ? <FiMinimize2 /> : <FiMaximize2 />}
            </button>
            <button
              style={buttonStyle}
              onClick={() => setShowPreviewPanel(false)}
              title="关闭预览"
            >
              ✕
            </button>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
          <select
            value={previewChartType}
            onChange={(e) => setPreviewChartType(e.target.value as any)}
            style={{ 
              padding: '6px 12px', 
              borderRadius: '4px', 
              border: '1px solid #e5e7eb',
              fontSize: '14px',
              flex: 1
            }}
          >
            <option value="bar">柱状图</option>
            <option value="line">折线图</option>
            <option value="pie">饼图</option>
            <option value="scatter">散点图</option>
            <option value="area">面积图</option>
            <option value="radar">雷达图</option>
          </select>
          <button
            style={{ 
              padding: '6px 12px', 
              borderRadius: '4px', 
              border: '1px solid #e5e7eb',
              backgroundColor: 'white',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
            onClick={() => {
              if (selectedNode && selectedNode.type === 'visualizationNode') {
                const randomData = generateRandomChartData(previewChartType);
                setPreviewChartData(randomData);
                
                // 更新节点数据
                const updatedNodeData = {
                  ...selectedNode.data,
                  config: {
                    ...selectedNode.data.config,
                    chartType: previewChartType,
                    sampleData: JSON.stringify(randomData)
                  }
                };
                
                updateNodeConfig(selectedNode.id, updatedNodeData);
              }
            }}
          >
            <FiRefreshCw size={14} />
            <span>随机数据</span>
          </button>
        </div>
        
        <div style={{ flex: 1, overflow: 'auto', minHeight: '250px' }}>
          <ChartPreview
            chartType={previewChartType}
            title="数据可视化"
            customData={previewChartData}
            height={isPreviewPanelMaximized ? 'calc(100vh - 220px)' : 250}
          />
        </div>
      </div>
    );
  };
  
  // 生成随机图表数据
  const generateRandomChartData = (chartType: string) => {
    const months = ['1月', '2月', '3月', '4月', '5月', '6月'];
    const getRandomValues = (count: number, max: number = 100) => 
      Array.from({ length: count }, () => Math.floor(Math.random() * max));
    
    switch (chartType) {
      case 'bar':
        return {
          labels: months,
          datasets: [
            {
              label: '数据集A',
              data: getRandomValues(6),
              backgroundColor: 'rgba(99, 102, 241, 0.6)',
            },
            {
              label: '数据集B',
              data: getRandomValues(6),
              backgroundColor: 'rgba(244, 114, 182, 0.6)',
            }
          ]
        };
        
      case 'line':
        return {
          labels: months,
          datasets: [
            {
              label: '数据集A',
              data: getRandomValues(6),
              borderColor: 'rgba(99, 102, 241, 1)',
              tension: 0.1
            },
            {
              label: '数据集B',
              data: getRandomValues(6),
              borderColor: 'rgba(244, 114, 182, 1)',
              tension: 0.1
            }
          ]
        };
        
      case 'pie':
        return {
          labels: ['类别A', '类别B', '类别C', '类别D'],
          datasets: [
            {
              data: getRandomValues(4),
              backgroundColor: [
                'rgba(99, 102, 241, 0.8)',
                'rgba(244, 114, 182, 0.8)',
                'rgba(52, 211, 153, 0.8)',
                'rgba(251, 191, 36, 0.8)'
              ]
            }
          ]
        };
        
      case 'scatter':
        return {
          labels: ['散点图'],
          datasets: [
            {
              label: '数据集A',
              data: Array.from({ length: 10 }, () => [
                Math.floor(Math.random() * 100),
                Math.floor(Math.random() * 100)
              ]),
              backgroundColor: 'rgba(99, 102, 241, 0.6)'
            }
          ]
        };
        
      case 'area':
        return {
          labels: months,
          datasets: [
            {
              label: '数据集A',
              data: getRandomValues(6),
              backgroundColor: 'rgba(99, 102, 241, 0.2)',
              borderColor: 'rgba(99, 102, 241, 1)',
              fill: true,
              tension: 0.3
            }
          ]
        };
        
      case 'radar':
        return {
          labels: ['指标A', '指标B', '指标C', '指标D', '指标E', '指标F'],
          datasets: [
            {
              label: '数据集A',
              data: getRandomValues(6),
              backgroundColor: 'rgba(99, 102, 241, 0.2)',
              borderColor: 'rgba(99, 102, 241, 1)',
              fill: true
            },
            {
              label: '数据集B',
              data: getRandomValues(6),
              backgroundColor: 'rgba(244, 114, 182, 0.2)',
              borderColor: 'rgba(244, 114, 182, 1)',
              fill: true
            }
          ]
        };
        
      default:
        return {
          labels: months,
          datasets: [
            {
              label: '数据集A',
              data: getRandomValues(6),
              backgroundColor: 'rgba(99, 102, 241, 0.6)'
            }
          ]
        };
    }
  };

  return (
    <div className="workflow-editor">
      <div className="sidebar-container">
        <Sidebar />
      </div>
      <div className="react-flow-container" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onNodeClick={onNodeClick}
          onEdgeClick={onEdgeClick}
          onPaneClick={onPaneClick}
          onNodesDelete={onNodesDelete}
          onEdgesDelete={onEdgesDelete}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          connectionLineType={connectionLineStyleMap[connectionLineStyle]}
          fitView
          attributionPosition="bottom-left"
        >
          <Controls />
          <MiniMap 
            nodeStrokeColor={(n) => {
              if (n.type === 'aiNode') return '#0041d0';
              if (n.type === 'triggerNode') return '#ff0072';
              if (n.type === 'outputNode') return '#1a192b';
              return '#eee';
            }}
            nodeColor={(n) => {
              if (n.type === 'aiNode') return '#d0e1ff';
              if (n.type === 'triggerNode') return '#ffcce3';
              if (n.type === 'outputNode') return '#ccc';
              return '#fff';
            }}
          />
          <Background color="#aaa" gap={16} />
          
          {/* 右侧固定工具栏 */}
          <div className="right-toolbar">
            <div className="toolbar-sections-container">
              <div className="toolbar-section">
                <h3 className="toolbar-title">基本操作</h3>
                <button className="toolbar-button" onClick={undo} disabled={historyIndex <= 0} title="撤销">
                  <FiCornerUpLeft /> 撤销
                </button>
                <button className="toolbar-button" onClick={redo} disabled={historyIndex >= historyStack.length - 1} title="重做">
                  <FiCornerUpRight /> 重做
                </button>
                <button className="toolbar-button" onClick={onSave} title="保存工作流">
                  <FiSave /> 保存工作流
                </button>
                <button className="toolbar-button" onClick={onRestore} title="恢复工作流">
                  <FiRefreshCw /> 恢复工作流
                </button>
              </div>
              
              <div className="toolbar-section">
                <h3 className="toolbar-title">导入导出</h3>
                <button className="toolbar-button" onClick={exportJSON} title="导出为JSON">
                  <FiDownload /> 导出为JSON
                </button>
                <button className="toolbar-button" onClick={exportImage} title="导出为图片">
                  <FiImage /> 导出为图片
                </button>
                <input
                  type="file"
                  accept=".json"
                  onChange={importJSON}
                  style={{ display: 'none' }}
                  id="import-json"
                />
                <label htmlFor="import-json" style={{ cursor: 'pointer' }}>
                  <button 
                    className="toolbar-button"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById('import-json')?.click();
                    }}
                  >
                    <FiUpload /> 导入JSON
                  </button>
                </label>
              </div>
              
              <div className="toolbar-section">
                <h3 className="toolbar-title">流程模板</h3>
                <div className="toolbar-form-group">
                  <label>工作流模板:</label>
                  <select 
                    className="toolbar-select"
                    onChange={(e) => generateTemplateWorkflow(e.target.value)}
                    defaultValue=""
                  >
                    <option value="" disabled>选择模板</option>
                    <option value="simple-qa">智能客服系统</option>
                    <option value="data-analysis">数据分析管道</option>
                    <option value="dashboard">动态数据仪表板</option>
                    <option value="document">自动化文档生成</option>
                  </select>
                </div>
              </div>
              
              <div className="toolbar-section">
                <h3 className="toolbar-title">连接设置</h3>
                <div className="toolbar-form-group">
                  <label>连接线样式:</label>
                  <select 
                    className="toolbar-select"
                    value={connectionLineStyle} 
                    onChange={(e) => onChangeConnectionLineStyle(e.target.value)}
                  >
                    <option value="bezier">贝塞尔曲线</option>
                    <option value="straight">直线</option>
                    <option value="step">阶梯线</option>
                    <option value="simplebezier">简单贝塞尔曲线</option>
                  </select>
                </div>
                <button className="toolbar-button" onClick={validateWorkflow} title="验证工作流">
                  <FiCheck /> 验证工作流
                </button>
              </div>
              
              <div className="toolbar-section">
                <h3 className="toolbar-title">图表类型</h3>
                <div className="chart-type-buttons">
                  <button 
                    className={`chart-type-button ${previewChartType === 'bar' ? 'active' : ''}`}
                    onClick={() => setPreviewChartType('bar')}
                    title="柱状图"
                  >
                    <FiBarChart2 />
                  </button>
                  <button 
                    className={`chart-type-button ${previewChartType === 'line' ? 'active' : ''}`}
                    onClick={() => setPreviewChartType('line')}
                    title="折线图"
                  >
                    <FiTrendingUp />
                  </button>
                  <button 
                    className={`chart-type-button ${previewChartType === 'pie' ? 'active' : ''}`}
                    onClick={() => setPreviewChartType('pie')}
                    title="饼图"
                  >
                    <FiPieChart />
                  </button>
                  <button 
                    className={`chart-type-button ${previewChartType === 'scatter' ? 'active' : ''}`}
                    onClick={() => setPreviewChartType('scatter')}
                    title="散点图"
                  >
                    <FiActivity />
                  </button>
                  <button 
                    className={`chart-type-button ${previewChartType === 'area' ? 'active' : ''}`}
                    onClick={() => setPreviewChartType('area')}
                    title="面积图"
                  >
                    <FiLayers />
                  </button>
                  <button 
                    className={`chart-type-button ${previewChartType === 'radar' ? 'active' : ''}`}
                    onClick={() => setPreviewChartType('radar')}
                    title="雷达图"
                  >
                    <FiGitBranch />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </ReactFlow>
      </div>
      {selectedNode && (
        <div className="node-config-panel-container">
          <NodeConfigPanel
            node={selectedNode}
            onClose={() => setSelectedNode(null)}
            onUpdateNodeData={updateNodeConfig}
          />
        </div>
      )}
      {selectedEdge && (
        <div className="edge-config-panel">
          <h3>边配置</h3>
          <div>
            <label>标签:</label>
            <input 
              type="text"
              value={selectedEdge.data?.label || ''}
              onChange={(e) => 
                updateEdgeConfig(selectedEdge.id, { label: e.target.value })
              }
            />
          </div>
          <div>
            <label>类型:</label>
            <select
              value={selectedEdge.data?.edgeType || 'bezier'}
              onChange={(e) => 
                updateEdgeConfig(selectedEdge.id, { edgeType: e.target.value })
              }
            >
              <option value="bezier">贝塞尔曲线</option>
              <option value="straight">直线</option>
              <option value="step">阶梯线</option>
              <option value="simplebezier">简单贝塞尔曲线</option>
            </select>
          </div>
          <button onClick={() => setSelectedEdge(null)}>关闭</button>
        </div>
      )}
      {isValidating && (
        <div className="validation-overlay">
          <div>验证中...</div>
        </div>
      )}
      {validationErrors.length > 0 && (
        <div className="validation-errors">
          <h3>验证错误</h3>
          <ul>
            {validationErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
          <button onClick={() => setValidationErrors([])}>关闭</button>
        </div>
      )}
      {renderPreviewPanel()}
    </div>
  );
};

export default function WorkflowEditorWithProvider() {
  return (
    <ReactFlowProvider>
      <WorkflowEditor />
    </ReactFlowProvider>
  );
}
