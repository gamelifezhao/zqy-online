'use client';

import React, { useState, useEffect } from 'react';
import { Card, Select, DatePicker, Row, Col, Statistic, Button, Tabs, Space, Alert, Spin, Dropdown, Tag, Progress, Tooltip, Menu, Typography, Empty, Divider } from 'antd';
import { ReloadOutlined, PrinterOutlined, SettingOutlined, InfoCircleOutlined, CaretUpOutlined, CaretDownOutlined, CheckCircleOutlined, CloseCircleOutlined, QuestionCircleOutlined, DashboardOutlined, BarChartOutlined, LineChartOutlined, PieChartOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import DashboardChart, { ChartType, ChartData, ChartOptions } from './DashboardChart';

const { RangePicker } = DatePicker;
const { TabPane } = Tabs;
const { Option } = Select;
const { Title, Text } = Typography;

// 时间颗粒度选项
const TIME_GRANULARITY = [
  { label: '小时', value: 'hour' },
  { label: '天', value: 'day' },
  { label: '周', value: 'week' },
  { label: '月', value: 'month' },
];

// 模型选项
const MODEL_OPTIONS = [
  { label: 'GPT-3.5', value: 'gpt-3.5' },
  { label: 'GPT-4', value: 'gpt-4' },
  { label: 'Claude-3-Opus', value: 'claude-3-opus' },
  { label: 'Claude-3-Sonnet', value: 'claude-3-sonnet' },
  { label: 'Gemini-1.0', value: 'gemini-1.0' },
];

// 模拟API调用数据生成
const generateMockData = (granularity: string, dateRange: [Dayjs, Dayjs], models: string[]) => {
  const startDate = dateRange[0].valueOf();
  const endDate = dateRange[1].valueOf();
  const diff = endDate - startDate;
  
  let interval;
  switch(granularity) {
    case 'hour': interval = 3600 * 1000; break;      // 1小时
    case 'day': interval = 24 * 3600 * 1000; break;  // 1天
    case 'week': interval = 7 * 24 * 3600 * 1000; break; // 1周
    case 'month': interval = 30 * 24 * 3600 * 1000; break; // 约1月
    default: interval = 24 * 3600 * 1000;
  }
  
  const pointCount = Math.max(5, Math.min(50, Math.floor(diff / interval)));
  const labels = [];
  
  for (let i = 0; i < pointCount; i++) {
    const date = new Date(startDate + (i * (diff / (pointCount - 1))));
    
    if (granularity === 'hour') {
      labels.push(`${date.getMonth()+1}月${date.getDate()}日 ${date.getHours()}时`);
    } else if (granularity === 'day') {
      labels.push(`${date.getMonth()+1}月${date.getDate()}日`);
    } else if (granularity === 'week') {
      labels.push(`${date.getMonth()+1}月${date.getDate()}日周`);
    } else if (granularity === 'month') {
      labels.push(`${date.getFullYear()}年${date.getMonth()+1}月`);
    }
  }
  
  // 生成不同模型的数据集
  const datasets = models.map(model => {
    const baseValue = MODEL_OPTIONS.findIndex(m => m.value === model) * 100 + 500;
    const data = Array.from({ length: pointCount }, (_, i) => {
      const trend = Math.sin(i / 5) * 50; // 添加波动
      const randomness = Math.random() * 100 - 50; // 添加随机性
      return Math.max(0, Math.round(baseValue + trend + randomness));
    });
    
    return {
      label: MODEL_OPTIONS.find(m => m.value === model)?.label || model,
      data,
      backgroundColor: getModelColor(model),
      borderColor: getModelColor(model)
    };
  });
  
  return {
    labels,
    datasets
  };
};

// 获取模型对应的颜色
const getModelColor = (model: string): string => {
  const colorMap: Record<string, string> = {
    'gpt-3.5': '#10B981',
    'gpt-4': '#0EA5E9',
    'claude-3-opus': '#8B5CF6',
    'claude-3-sonnet': '#EC4899',
    'gemini-1.0': '#F59E0B',
  };
  
  return colorMap[model] || '#6B7280';
};

// 十六进制颜色转rgba
const hexToRgba = (hex: string, opacity: number) => {
  // 移除#号如果存在
  let h = hex.replace('#', '');
  
  // 如果是简写形式(#fff)转为完整形式(#ffffff)
  if(h.length === 3) {
    h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  }
  
  // 提取rgb值
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  
  // 返回rgba格式
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

// 生成响应时间数据
const generateResponseTimeData = (granularity: string, dateRange: [Dayjs, Dayjs], models: string[]) => {
  const data = generateMockData(granularity, dateRange, models);
  
  // 调整为响应时间数据（毫秒）
  data.datasets = data.datasets.map(dataset => ({
    ...dataset,
    data: dataset.data.map(v => Math.round(v / 10) * 10 + 100), // 转换为响应时间范围
  }));
  
  return data;
};

// 生成错误率数据
const generateErrorRateData = (granularity: string, dateRange: [Dayjs, Dayjs], models: string[]) => {
  const data = generateMockData(granularity, dateRange, models);
  
  // 调整为错误率数据（0-10%）
  data.datasets = data.datasets.map(dataset => ({
    ...dataset,
    data: dataset.data.map(v => parseFloat((Math.random() * 10).toFixed(2))), // 转换为错误率范围
  }));
  
  return data;
};

// 生成成本数据
const generateCostData = (granularity: string, dateRange: [Dayjs, Dayjs], models: string[]) => {
  const data = generateMockData(granularity, dateRange, models);
  
  // 调整为成本数据（美元）
  data.datasets = data.datasets.map(dataset => {
    const modelMultiplier = MODEL_OPTIONS.findIndex(m => m.label === dataset.label) + 1;
    return {
      ...dataset,
      data: dataset.data.map(v => parseFloat(((v / 100) * modelMultiplier).toFixed(2))), // 转换为成本范围
    };
  });
  
  return data;
};

// 生成用户满意度数据
const generateSatisfactionData = (granularity: string, dateRange: [Dayjs, Dayjs], models: string[]) => {
  const data = generateMockData(granularity, dateRange, models);
  
  // 调整为满意度数据（1-5）
  data.datasets = data.datasets.map(dataset => ({
    ...dataset,
    data: dataset.data.map(v => parseFloat((3 + Math.random() * 2).toFixed(1))), // 转换为满意度范围
  }));
  
  return data;
};

// 生成质量评分数据
const generateQualityScoreData = (granularity: string, dateRange: [Dayjs, Dayjs], models: string[]) => {
  const data = generateMockData(granularity, dateRange, models);
  
  // 调整为质量评分数据（0-100）
  data.datasets = data.datasets.map(dataset => ({
    ...dataset,
    data: dataset.data.map(v => Math.min(100, Math.round(60 + Math.random() * 40))), // 转换为质量评分范围
  }));
  
  return data;
};

// 生成会话分析数据
const generateSessionData = (dateRange: [Dayjs, Dayjs]) => {
  const sessionMetrics = [
    { name: '平均会话时长', value: Math.round(120 + Math.random() * 360), unit: '秒' },
    { name: '平均消息数/会话', value: Math.round(5 + Math.random() * 10), unit: '条' },
    { name: '会话完成率', value: Math.round(75 + Math.random() * 25), unit: '%' },
    { name: '单轮会话占比', value: Math.round(20 + Math.random() * 30), unit: '%' },
    { name: '多轮深度对话占比', value: Math.round(40 + Math.random() * 40), unit: '%' },
    { name: '用户满意度评分', value: parseFloat((3.5 + Math.random() * 1.5).toFixed(1)), unit: '/5分' },
  ];
  
  return sessionMetrics;
};

// 生成异常检测数据
const generateAnomalyData = () => {
  const anomalyTypes = [
    '响应时间异常增加',
    'API调用量突增',
    '错误率超过阈值',
    '成本异常增长',
    '用户满意度大幅下降',
  ];
  
  const anomalyCount = Math.floor(Math.random() * 3); // 0-2个异常
  const anomalies = [];
  
  for (let i = 0; i < anomalyCount; i++) {
    const randomType = anomalyTypes[Math.floor(Math.random() * anomalyTypes.length)];
    const timeAgo = Math.floor(Math.random() * 24) + 1;
    
    anomalies.push({
      type: randomType,
      timestamp: new Date(Date.now() - timeAgo * 3600 * 1000).toISOString(),
      severity: Math.random() > 0.7 ? '严重' : Math.random() > 0.4 ? '中等' : '一般',
      details: `检测到${randomType}，可能影响用户体验，建议关注。`,
    });
  }
  
  return anomalies;
};

interface PerformanceDashboardProps {
  appId?: string;  // 可选的应用ID参数
}

export default function PerformanceDashboard({ appId }: PerformanceDashboardProps) {
  // 状态管理
  const [loading, setLoading] = useState<boolean>(true);
  const [granularity, setGranularity] = useState<string>('day');
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
    dayjs().subtract(30, 'day'), // 30天前
    dayjs() // 当前
  ]);
  const [selectedModels, setSelectedModels] = useState<string[]>(['gpt-3.5', 'gpt-4']);
  
  // 图表数据状态
  const [callVolumeData, setCallVolumeData] = useState<any>(null);
  const [responseTimeData, setResponseTimeData] = useState<any>(null);
  const [errorRateData, setErrorRateData] = useState<any>(null);
  const [costData, setCostData] = useState<any>(null);
  const [satisfactionData, setSatisfactionData] = useState<any>(null);
  const [qualityScoreData, setQualityScoreData] = useState<any>(null);
  const [sessionMetrics, setSessionMetrics] = useState<any[]>([]);
  const [anomalies, setAnomalies] = useState<any[]>([]);
  const [activeTabKey, setActiveTabKey] = useState<string>("overview");
  
  // 加载数据
  const loadData = () => {
    setLoading(true);
    
    // 模拟异步数据加载
    setTimeout(() => {
      setCallVolumeData({
        type: 'bar',
        data: generateMockData(granularity, dateRange, selectedModels),
        options: {
          title: 'API调用量',
          yAxisLabel: '调用次数',
        }
      });
      
      setResponseTimeData({
        type: 'line',
        data: generateResponseTimeData(granularity, dateRange, selectedModels),
        options: {
          title: '平均响应时间',
          yAxisLabel: '毫秒',
        }
      });
      
      setErrorRateData({
        type: 'line',
        data: generateErrorRateData(granularity, dateRange, selectedModels),
        options: {
          title: '错误率',
          yAxisLabel: '百分比 (%)',
        }
      });
      
      setCostData({
        type: 'area',
        data: generateCostData(granularity, dateRange, selectedModels),
        options: {
          title: 'API调用成本',
          yAxisLabel: '美元 ($)',
          stacked: true,
        }
      });
      
      setSatisfactionData({
        type: 'line',
        data: generateSatisfactionData(granularity, dateRange, selectedModels),
        options: {
          title: '用户满意度',
          yAxisLabel: '评分 (1-5)',
        }
      });
      
      setQualityScoreData({
        type: 'radar',
        data: generateQualityScoreData(granularity, dateRange, selectedModels),
        options: {
          title: '质量评分',
          scale: {
            min: 0,
            max: 100
          }
        }
      });
      
      setSessionMetrics(generateSessionData(dateRange));
      setAnomalies(generateAnomalyData());
      
      setLoading(false);
    }, 1200); // 增加加载时间以展示加载效果
  };
  
  // 初始加载
  useEffect(() => {
    loadData();
  }, []);
  
  // 刷新数据
  const handleRefresh = () => {
    loadData();
  };
  
  // 模型选择变更
  const handleModelChange = (models: string[]) => {
    setSelectedModels(models);
  };
  
  // 时间粒度变更
  const handleGranularityChange = (value: string) => {
    setGranularity(value);
  };
  
  // 日期范围变更
  const handleDateRangeChange = (dates: [Dayjs, Dayjs]) => {
    setDateRange(dates);
  };

  // 导出为PDF (触发Ctrl+P)
  const handleExportPDF = () => {
    window.print();
  };

  // 渲染选项控制面板
  const renderControlPanel = () => {
    return (
      <div className="control-panel bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-6 flex-grow">
          <div className="flex items-center gap-2">
            <Typography.Text strong>模型:</Typography.Text>
            <Select
              mode="multiple"
              value={selectedModels}
              onChange={handleModelChange}
              style={{ width: 240 }}
              options={[
                { label: 'GPT-3.5', value: 'gpt-3.5' },
                { label: 'GPT-4', value: 'gpt-4' },
                { label: 'Claude-3-Opus', value: 'claude-3-opus' },
                { label: 'Claude-3-Sonnet', value: 'claude-3-sonnet' },
                { label: 'Gemini-1.0', value: 'gemini-1.0' },
              ]}
              placeholder="选择模型"
              className="min-w-[200px]"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Typography.Text strong>粒度:</Typography.Text>
            <Select
              value={granularity}
              onChange={handleGranularityChange}
              style={{ width: 100 }}
              options={[
                { label: '小时', value: 'hour' },
                { label: '天', value: 'day' },
                { label: '周', value: 'week' },
                { label: '月', value: 'month' },
              ]}
              className="min-w-[100px]"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Typography.Text strong>日期:</Typography.Text>
            <DatePicker.RangePicker
              value={dateRange as any}
              onChange={handleDateRangeChange as any}
              className="min-w-[250px]"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Tooltip title="刷新数据">
            <Button 
              icon={<ReloadOutlined />} 
              onClick={handleRefresh}
              loading={loading}
              type="primary"
              ghost
            >
              刷新
            </Button>
          </Tooltip>
          <Tooltip title="导出为PDF">
            <Button icon={<PrinterOutlined />} onClick={handleExportPDF}>导出</Button>
          </Tooltip>
          <Tooltip title="设置">
            <Button icon={<SettingOutlined />} />
          </Tooltip>
        </div>
      </div>
    );
  };

  // 渲染顶部统计卡片
  const renderStatCards = () => {
    // 使用准备好的仪表盘数据
    const apiCallsToday = Math.round(Math.random() * 5000 + 8000);
    const apiCallsYesterday = Math.round(Math.random() * 5000 + 7000);
    const apiCallsChange = ((apiCallsToday - apiCallsYesterday) / apiCallsYesterday) * 100;
    
    const avgResponseTime = Math.round(Math.random() * 200 + 300);
    const prevAvgResponseTime = Math.round(Math.random() * 200 + 350);
    const responseTimeChange = ((avgResponseTime - prevAvgResponseTime) / prevAvgResponseTime) * 100;
    
    const errorRate = parseFloat((Math.random() * 2).toFixed(2));
    const prevErrorRate = parseFloat((Math.random() * 3).toFixed(2));
    const errorRateChange = ((errorRate - prevErrorRate) / prevErrorRate) * 100;
    
    const costToday = parseFloat((Math.random() * 200 + 100).toFixed(2));
    const costYesterday = parseFloat((Math.random() * 150 + 100).toFixed(2));
    const costChange = ((costToday - costYesterday) / costYesterday) * 100;
    
    return (
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} className="dashboard-stat-card shadow-sm h-full">
            <Statistic
              title={
                <div className="flex items-center gap-2">
                  <BarChartOutlined className="text-blue-500" />
                  <span>今日API调用</span>
                </div>
              }
              value={apiCallsToday}
              precision={0}
              valueStyle={{ color: '#1890ff' }}
              suffix={
                <div className="ml-2 flex items-center">
                  <Tag color={apiCallsChange >= 0 ? 'blue' : 'red'} className="flex items-center text-xs">
                    {apiCallsChange >= 0 ? <CaretUpOutlined /> : <CaretDownOutlined />}
                    {Math.abs(apiCallsChange).toFixed(1)}%
                  </Tag>
                </div>
              }
            />
            <div className="text-xs text-gray-500 mt-2">较昨日: {apiCallsChange >= 0 ? '增加' : '减少'}</div>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} className="dashboard-stat-card shadow-sm h-full">
            <Statistic
              title={
                <div className="flex items-center gap-2">
                  <LineChartOutlined className="text-green-500" />
                  <span>平均响应时间</span>
                </div>
              }
              value={avgResponseTime}
              precision={0}
              valueStyle={{ color: '#52c41a' }}
              suffix={
                <div className="ml-2 flex items-center">
                  <span className="text-gray-500">ms</span>
                  <Tag color={responseTimeChange <= 0 ? 'green' : 'red'} className="flex items-center text-xs ml-2">
                    {responseTimeChange <= 0 ? <CaretDownOutlined /> : <CaretUpOutlined />}
                    {Math.abs(responseTimeChange).toFixed(1)}%
                  </Tag>
                </div>
              }
            />
            <div className="text-xs text-gray-500 mt-2">较上周期: {responseTimeChange <= 0 ? '改善' : '恶化'}</div>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} className="dashboard-stat-card shadow-sm h-full">
            <Statistic
              title={
                <div className="flex items-center gap-2">
                  <InfoCircleOutlined className="text-red-500" />
                  <span>错误率</span>
                </div>
              }
              value={errorRate}
              precision={2}
              valueStyle={{ color: '#ff4d4f' }}
              suffix={
                <div className="ml-2 flex items-center">
                  <span className="text-gray-500">%</span>
                  <Tag color={errorRateChange <= 0 ? 'green' : 'red'} className="flex items-center text-xs ml-2">
                    {errorRateChange <= 0 ? <CaretDownOutlined /> : <CaretUpOutlined />}
                    {Math.abs(errorRateChange).toFixed(1)}%
                  </Tag>
                </div>
              }
            />
            <div className="text-xs text-gray-500 mt-2">较上周期: {errorRateChange <= 0 ? '改善' : '恶化'}</div>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} className="dashboard-stat-card shadow-sm h-full">
            <Statistic
              title={
                <div className="flex items-center gap-2">
                  <PieChartOutlined className="text-amber-500" />
                  <span>今日成本</span>
                </div>
              }
              value={costToday}
              precision={2}
              valueStyle={{ color: '#fa8c16' }}
              prefix="¥"
              suffix={
                <div className="ml-2 flex items-center">
                  <Tag color={costChange >= 0 ? 'warning' : 'success'} className="flex items-center text-xs">
                    {costChange >= 0 ? <CaretUpOutlined /> : <CaretDownOutlined />}
                    {Math.abs(costChange).toFixed(1)}%
                  </Tag>
                </div>
              }
            />
            <div className="text-xs text-gray-500 mt-2">较昨日: {costChange >= 0 ? '增加' : '减少'}</div>
          </Card>
        </Col>
      </Row>
    );
  };

  // 异常检测图表
  const renderAnomalyChart = () => {
    const anomalies = generateAnomalyData();
    
    // 为异常检测数据创建适合的ECharts数据结构
    const chartData: ChartData = {
      labels: new Array(100).fill(0).map((_, i) => `ID-${i}`),
      datasets: [
        {
          label: '正常值',
          data: new Array(100).fill(0).map(() => Math.random() * 300 + 100),
          borderColor: '#52c41a',
          backgroundColor: hexToRgba('#52c41a', 0.2),
          fill: false
        },
        {
          label: '异常值',
          data: new Array(5).fill(0).map(() => Math.random() * 800 + 400).concat(new Array(95).fill(null)),
          borderColor: '#f5222d',
          backgroundColor: '#f5222d',
          fill: false
        }
      ]
    };
    
    const options: ChartOptions = {
      title: '性能异常检测',
      yAxisLabel: '响应时间 (ms)',
      xAxisLabel: '请求ID'
    };
    
    return <DashboardChart type="scatter" data={chartData} options={options} loading={loading} allowTypeChange={true} />;
  };

  // API调用量图表
  const renderApiCallsChart = () => {
    const mockData = generateMockData(granularity, dateRange, selectedModels);
    const chartData: ChartData = {
      labels: mockData.labels,
      datasets: selectedModels.map(model => ({
        label: model,
        data: generateMockData(granularity, dateRange, [model]).datasets[0].data,
        backgroundColor: getModelColor(model),
        borderColor: getModelColor(model)
      }))
    };
    
    const options: ChartOptions = {
      title: 'API调用量趋势',
      yAxisLabel: '调用次数',
      xAxisLabel: '时间',
      stacked: true
    };
    
    return <DashboardChart type="bar" data={chartData} options={options} loading={loading} allowTypeChange={true} />;
  };
  
  // 响应时间图表
  const renderResponseTimeChart = () => {
    const responseData = generateResponseTimeData(granularity, dateRange, selectedModels);
    const chartData: ChartData = {
      labels: responseData.labels,
      datasets: selectedModels.map(model => ({
        label: model,
        data: generateResponseTimeData(granularity, dateRange, [model]).datasets[0].data,
        borderColor: getModelColor(model),
        backgroundColor: hexToRgba(getModelColor(model), 0.2),
        fill: false
      }))
    };
    
    const options: ChartOptions = {
      title: '响应时间趋势',
      yAxisLabel: '响应时间 (ms)',
      xAxisLabel: '时间'
    };
    
    return <DashboardChart type="line" data={chartData} options={options} loading={loading} allowTypeChange={true} />;
  };
  
  // 错误率图表
  const renderErrorRateChart = () => {
    const errorData = generateErrorRateData(granularity, dateRange, selectedModels);
    const chartData: ChartData = {
      labels: errorData.labels,
      datasets: selectedModels.map(model => ({
        label: model,
        data: generateErrorRateData(granularity, dateRange, [model]).datasets[0].data,
        borderColor: getModelColor(model),
        backgroundColor: hexToRgba(getModelColor(model), 0.2),
        fill: true
      }))
    };
    
    const options: ChartOptions = {
      title: '错误率趋势',
      yAxisLabel: '错误率 (%)',
      xAxisLabel: '时间'
    };
    
    return <DashboardChart type="area" data={chartData} options={options} loading={loading} allowTypeChange={true} />;
  };
  
  // 成本分析图表
  const renderCostChart = () => {
    const costData = generateCostData(granularity, dateRange, selectedModels);
    const chartData: ChartData = {
      labels: costData.labels,
      datasets: selectedModels.map(model => ({
        label: model,
        data: generateCostData(granularity, dateRange, [model]).datasets[0].data,
        backgroundColor: getModelColor(model),
        borderColor: getModelColor(model)
      }))
    };
    
    const options: ChartOptions = {
      title: '成本分析',
      yAxisLabel: '成本 (元)',
      xAxisLabel: '时间',
      stacked: true
    };
    
    return <DashboardChart type="bar" data={chartData} options={options} loading={loading} allowTypeChange={true} />;
  };
  
  // 用户满意度图表
  const renderSatisfactionChart = () => {
    const satisfactionData = generateSatisfactionData(granularity, dateRange, selectedModels);
    const chartData: ChartData = {
      labels: satisfactionData.labels,
      datasets: [{
        label: '用户满意度',
        data: satisfactionData.datasets[0].data,
        borderColor: '#52c41a',
        backgroundColor: hexToRgba('#52c41a', 0.2),
        fill: true
      }]
    };
    
    const options: ChartOptions = {
      title: '用户满意度趋势',
      yAxisLabel: '满意度评分',
      xAxisLabel: '时间'
    };
    
    return <DashboardChart type="line" data={chartData} options={options} loading={loading} allowTypeChange={true} />;
  };
  
  // 质量评分图表
  const renderQualityChart = () => {
    const qualityData = generateQualityScoreData(granularity, dateRange, selectedModels);
    
    // 确保生成正确格式的图表数据
    const chartData: ChartData = {
      labels: selectedModels, // 模型名称作为标签
      datasets: [{
        label: '质量评分',
        data: qualityData.datasets[0].data, // 直接使用生成的数据
        backgroundColor: selectedModels.map(model => getModelColor(model))
      }]
    };
    
    const options: ChartOptions = {
      title: '模型质量评分对比'
    };
    
    return <DashboardChart type="pie" data={chartData} options={options} loading={loading} allowTypeChange={true} />;
  };
  
  // 会话分析图表
  const renderSessionChart = () => {
    const sessionMetrics = generateSessionData(dateRange);
    // 将会话数据转换为图表可用格式
    const chartData: ChartData = {
      labels: sessionMetrics.map(item => item.name),
      datasets: [
        {
          label: '会话分析',
          data: sessionMetrics.map(item => item.value),
          backgroundColor: sessionMetrics.map(() => `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.7)`),
          borderColor: '#1890ff'
        }
      ]
    };
    
    const options: ChartOptions = {
      title: '会话分析',
      yAxisLabel: '数值',
      xAxisLabel: '指标'
    };
    
    return <DashboardChart type="bar" data={chartData} options={options} loading={loading} allowTypeChange={true} />;
  };

  // 渲染图表
  const renderChart = (type: string) => {
    if (loading) return <Spin tip="加载数据中..." />;
    
    switch (type) {
      case 'apiCalls':
        return renderApiCallsChart();
      case 'responseTime':
        return renderResponseTimeChart();
      case 'errorRate':
        return renderErrorRateChart();
      case 'cost':
        return renderCostChart();
      case 'satisfaction':
        return renderSatisfactionChart();
      case 'quality':
        return renderQualityChart();
      case 'session':
        return renderSessionChart();
      case 'anomaly':
        return renderAnomalyChart();
      default:
        return <Empty description="暂无数据" />;
    }
  };

  return (
    <div className="performance-dashboard bg-gray-50 min-h-screen p-6">
      <div className="dashboard-header mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-semibold flex items-center gap-2 m-0 mb-1">
              <DashboardOutlined /> 性能监控仪表板
            </h1>
            <p className="text-gray-500 text-sm m-0">全面监控和分析API调用和模型性能指标</p>
          </div>
        </div>
        
        {renderStatCards()}
        
        {anomalies.length > 0 && (
          <div className="mb-6">
            <Alert
              type="warning"
              showIcon
              message={`检测到 ${anomalies.length} 个性能异常`}
              description={
                <div className="mt-2">
                  {anomalies.map((anomaly, index) => (
                    <div key={index} className="mt-2 p-2 bg-amber-50 rounded border border-amber-200">
                      <div className="flex items-center gap-2">
                        <Tag color={anomaly.severity === '严重' ? 'red' : anomaly.severity === '中等' ? 'orange' : 'blue'}>
                          {anomaly.severity}
                        </Tag>
                        <span className="font-medium">{anomaly.type}</span>
                        <span className="text-gray-500 text-xs ml-auto">
                          {new Date(anomaly.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm mt-1 text-gray-600">{anomaly.details}</p>
                    </div>
                  ))}
                </div>
              }
            />
          </div>
        )}
        
        {renderControlPanel()}
      </div>
      
      <div className="dashboard-content">
        <Tabs 
          activeKey={activeTabKey}
          onChange={setActiveTabKey}
          type="card"
          className="dashboard-tabs custom-tabs"
          tabBarStyle={{ marginBottom: 16, background: '#fff', padding: '8px 8px 0', borderRadius: '8px 8px 0 0' }}
          items={[
            {
              key: 'overview',
              label: (
                <span className="flex items-center gap-1">
                  <DashboardOutlined />
                  概览
                </span>
              ),
              children: (
                <Row gutter={[16, 16]}>
                  <Col xs={24} lg={12}>
                    <Card 
                      title="API调用量" 
                      className="dashboard-card shadow-sm" 
                      bodyStyle={{ height: 350, padding: 0 }}
                    >
                      {renderChart('apiCalls')}
                    </Card>
                  </Col>
                  
                  <Col xs={24} lg={12}>
                    <Card 
                      title="响应时间" 
                      className="dashboard-card shadow-sm"
                      bodyStyle={{ height: 350, padding: 0 }}
                    >
                      {renderChart('responseTime')}
                    </Card>
                  </Col>
                  
                  <Col xs={24} lg={12}>
                    <Card 
                      title="错误率" 
                      className="dashboard-card shadow-sm"
                      bodyStyle={{ height: 350, padding: 0 }}
                    >
                      {renderChart('errorRate')}
                    </Card>
                  </Col>
                  
                  <Col xs={24} lg={12}>
                    <Card 
                      title="成本分析" 
                      className="dashboard-card shadow-sm"
                      bodyStyle={{ height: 350, padding: 0 }}
                    >
                      {renderChart('cost')}
                    </Card>
                  </Col>
                </Row>
              )
            },
            {
              key: 'comparison',
              label: (
                <span className="flex items-center gap-1">
                  <BarChartOutlined />
                  模型对比
                </span>
              ),
              children: (
                <Row gutter={[16, 16]}>
                  <Col xs={24} lg={12}>
                    <Card 
                      title="响应时间对比" 
                      className="dashboard-card shadow-sm"
                      bodyStyle={{ height: 350, padding: 0 }}
                    >
                      {renderChart('responseTime')}
                    </Card>
                  </Col>
                  
                  <Col xs={24} lg={12}>
                    <Card 
                      title="错误率对比" 
                      className="dashboard-card shadow-sm"
                      bodyStyle={{ height: 350, padding: 0 }}
                    >
                      {renderChart('errorRate')}
                    </Card>
                  </Col>
                  
                  <Col xs={24} lg={12}>
                    <Card 
                      title="质量评分对比" 
                      className="dashboard-card shadow-sm"
                      bodyStyle={{ height: 350, padding: 0 }}
                    >
                      {renderChart('quality')}
                    </Card>
                  </Col>
                  
                  <Col xs={24} lg={12}>
                    <Card 
                      title="成本效益对比" 
                      className="dashboard-card shadow-sm"
                      bodyStyle={{ height: 350, padding: 0 }}
                    >
                      {renderChart('cost')}
                    </Card>
                  </Col>
                </Row>
              )
            },
            {
              key: 'user-experience',
              label: (
                <span className="flex items-center gap-1">
                  <LineChartOutlined />
                  用户体验
                </span>
              ),
              children: (
                <Row gutter={[16, 16]}>
                  <Col xs={24} lg={12}>
                    <Card 
                      title="用户满意度" 
                      className="dashboard-card shadow-sm"
                      bodyStyle={{ height: 350, padding: 0 }}
                    >
                      {renderChart('satisfaction')}
                    </Card>
                  </Col>
                  
                  <Col xs={24} lg={12}>
                    <Card 
                      title="会话分析" 
                      className="dashboard-card shadow-sm"
                      bodyStyle={{ height: 350, padding: 0 }}
                    >
                      {renderChart('session')}
                    </Card>
                  </Col>
                  
                  <Col xs={24}>
                    <Card 
                      title="会话统计" 
                      className="dashboard-card shadow-sm"
                    >
                      <Row gutter={[24, 24]}>
                        {sessionMetrics.map((metric, index) => (
                          <Col key={index} xs={24} sm={12} md={8} lg={6}>
                            <Card bordered={false} className="text-center bg-gray-50 h-full">
                              <Statistic
                                title={metric.name}
                                value={metric.value}
                                suffix={metric.unit}
                                valueStyle={{ color: '#1890ff' }}
                              />
                              {metric.name.includes('率') || metric.name.includes('比') ? (
                                <Progress 
                                  percent={metric.value} 
                                  showInfo={false}
                                  strokeColor={{
                                    '0%': '#108ee9',
                                    '100%': '#87d068',
                                  }}
                                  className="mt-2"
                                />
                              ) : null}
                            </Card>
                          </Col>
                        ))}
                      </Row>
                    </Card>
                  </Col>
                </Row>
              )
            },
            {
              key: 'anomalies',
              label: (
                <span className="flex items-center gap-1">
                  <InfoCircleOutlined />
                  异常监控
                </span>
              ),
              children: (
                <Row gutter={[16, 16]}>
                  <Col xs={24}>
                    <Card 
                      title="性能异常检测" 
                      className="dashboard-card shadow-sm"
                      bodyStyle={{ height: 350, padding: 0 }}
                    >
                      {renderChart('anomaly')}
                    </Card>
                  </Col>
                  
                  <Col xs={24}>
                    <Card 
                      title="异常日志" 
                      className="dashboard-card shadow-sm"
                    >
                      {anomalies.length > 0 ? (
                        <div>
                          {anomalies.map((anomaly, index) => (
                            <React.Fragment key={index}>
                              <div className="flex items-start py-3">
                                <div className="mr-4">
                                  {anomaly.severity === '严重' ? (
                                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                                      <CloseCircleOutlined className="text-red-500 text-lg" />
                                    </div>
                                  ) : anomaly.severity === '中等' ? (
                                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                                      <InfoCircleOutlined className="text-orange-500 text-lg" />
                                    </div>
                                  ) : (
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                      <QuestionCircleOutlined className="text-blue-500 text-lg" />
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center">
                                    <h4 className="text-base font-medium m-0">{anomaly.type}</h4>
                                    <Tag 
                                      color={anomaly.severity === '严重' ? 'red' : anomaly.severity === '中等' ? 'orange' : 'blue'}
                                      className="ml-2"
                                    >
                                      {anomaly.severity}
                                    </Tag>
                                    <span className="text-gray-400 text-xs ml-auto">
                                      {new Date(anomaly.timestamp).toLocaleString()}
                                    </span>
                                  </div>
                                  <p className="text-gray-600 mt-1 mb-0">{anomaly.details}</p>
                                  <div className="mt-2">
                                    <Button type="link" size="small" className="p-0">查看详情</Button>
                                    <Button type="link" size="small" className="p-0 ml-4">忽略</Button>
                                    <Button type="link" size="small" className="p-0 ml-4">标记为已解决</Button>
                                  </div>
                                </div>
                              </div>
                              {index < anomalies.length - 1 && <Divider className="my-1" />}
                            </React.Fragment>
                          ))}
                        </div>
                      ) : (
                        <Empty description="暂无异常数据" />
                      )}
                    </Card>
                  </Col>
                </Row>
              )
            }
          ]}
        />
      </div>
    </div>
  );
}
