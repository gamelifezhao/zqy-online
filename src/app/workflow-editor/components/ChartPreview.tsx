import React, { useState } from 'react';
import ChartRenderer from './ChartRenderer';
import './ChartRenderer.css';
import { 
  FiRefreshCw, 
  FiDownload, 
  FiMaximize, 
  FiMoon, 
  FiSun
} from 'react-icons/fi';

// 样本数据生成函数
const generateSampleData = (chartType: string) => {
  const months = ['1月', '2月', '3月', '4月', '5月', '6月'];
  
  switch (chartType) {
    case 'bar':
      return {
        labels: months,
        datasets: [
          {
            label: '销售额',
            data: [65, 59, 80, 81, 56, 55],
            backgroundColor: 'rgba(99, 102, 241, 0.6)',
          },
          {
            label: '成本',
            data: [28, 48, 40, 19, 36, 27],
            backgroundColor: 'rgba(244, 114, 182, 0.6)',
          }
        ]
      };
      
    case 'line':
      return {
        labels: months,
        datasets: [
          {
            label: '用户增长',
            data: [12, 19, 3, 5, 2, 3],
            borderColor: 'rgba(99, 102, 241, 1)',
            tension: 0.1
          },
          {
            label: '活跃度',
            data: [5, 15, 10, 12, 20, 15],
            borderColor: 'rgba(244, 114, 182, 1)',
            tension: 0.1
          }
        ]
      };
      
    case 'pie':
      return {
        labels: ['移动端', '桌面端', '平板', '其他'],
        datasets: [
          {
            data: [300, 150, 100, 50],
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
            label: '数据集 A',
            data: [[10, 20], [30, 40], [50, 60], [70, 30], [40, 10], [20, 50]],
            backgroundColor: 'rgba(99, 102, 241, 0.6)'
          }
        ]
      };
      
    case 'area':
      return {
        labels: months,
        datasets: [
          {
            label: '收入',
            data: [30, 60, 40, 50, 90, 70],
            backgroundColor: 'rgba(99, 102, 241, 0.2)',
            borderColor: 'rgba(99, 102, 241, 1)',
            fill: true,
            tension: 0.3
          }
        ]
      };
      
    case 'radar':
      return {
        labels: ['市场洞察', '产品功能', '用户体验', '可靠性', '性能', '安全性'],
        datasets: [
          {
            label: '产品 A',
            data: [65, 59, 90, 81, 56, 55],
            backgroundColor: 'rgba(99, 102, 241, 0.2)',
            borderColor: 'rgba(99, 102, 241, 1)',
            fill: true
          },
          {
            label: '产品 B',
            data: [28, 48, 40, 19, 96, 27],
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
            label: '示例数据',
            data: [65, 59, 80, 81, 56, 55],
            backgroundColor: 'rgba(99, 102, 241, 0.6)'
          }
        ]
      };
  }
};

interface ChartPreviewProps {
  chartType: 'bar' | 'line' | 'pie' | 'scatter' | 'area' | 'radar';
  title?: string;
  width?: string | number;
  height?: string | number;
  customData?: any;
  customOptions?: any;
}

const ChartPreview: React.FC<ChartPreviewProps> = ({
  chartType,
  title = '图表预览',
  width = '100%',
  height = 350,
  customData,
  customOptions = {}
}) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // 使用自定义数据或生成样本数据
  const chartData = customData || generateSampleData(chartType);
  
  // 刷新图表函数
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };
  
  // 切换主题函数
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  
  // 下载图表函数（仅占位）
  const handleDownload = () => {
    alert('图表下载功能将在未来版本中实现');
  };
  
  // 图表全屏函数（仅占位）
  const handleFullscreen = () => {
    alert('图表全屏功能将在未来版本中实现');
  };
  
  return (
    <div className={`chart-preview ${theme === 'dark' ? 'chart-preview-dark' : ''}`}>
      <div className="chart-toolbar">
        <h3 className="chart-title">{title}</h3>
        <div className="chart-controls">
          <button
            className="chart-control-button"
            onClick={handleRefresh}
            title="刷新图表"
          >
            <FiRefreshCw 
              size={16} 
              className={isRefreshing ? 'spin' : ''} 
            />
          </button>
          <button
            className="chart-control-button"
            onClick={toggleTheme}
            title={theme === 'light' ? '切换到暗色模式' : '切换到亮色模式'}
          >
            {theme === 'light' ? <FiMoon size={16} /> : <FiSun size={16} />}
          </button>
          <button
            className="chart-control-button"
            onClick={handleFullscreen}
            title="全屏显示"
          >
            <FiMaximize size={16} />
          </button>
          <button
            className="chart-control-button"
            onClick={handleDownload}
            title="下载图表"
          >
            <FiDownload size={16} />
          </button>
        </div>
      </div>
      
      <div className="chart-container">
        <ChartRenderer
          chartType={chartType}
          data={chartData}
          options={{
            title: { text: '', show: false },
            ...customOptions
          }}
          width={width}
          height={height}
          theme={theme}
        />
      </div>
    </div>
  );
};

export default ChartPreview;
