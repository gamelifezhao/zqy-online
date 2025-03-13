import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts/core';
import {
  BarChart,
  LineChart,
  PieChart,
  ScatterChart,
  RadarChart
} from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LegendComponent,
  ToolboxComponent
} from 'echarts/components';
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

// 注册必要的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LegendComponent,
  ToolboxComponent,
  BarChart,
  LineChart,
  PieChart,
  ScatterChart,
  RadarChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer
]);

// 定义支持的图表类型
type ChartType = 'pie' | 'bar' | 'line' | 'scatter' | 'area' | 'radar';

interface ChartData {
  labels?: string[];
  datasets?: Array<{
    label?: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    fill?: boolean;
    tension?: number;
  }>;
  [key: string]: any;
}

interface ChartRendererProps {
  chartType: ChartType;
  data: ChartData;
  options?: any;
  width?: string | number;
  height?: string | number;
  theme?: 'light' | 'dark';
}

const ChartRenderer: React.FC<ChartRendererProps> = ({
  chartType,
  data,
  options = {},
  width = '100%',
  height = 300,
  theme = 'light'
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  // 将Chart.js数据格式转换为ECharts格式
  const convertToEChartsOption = (type: ChartType, chartData: ChartData, customOptions: any = {}) => {
    const { labels, datasets } = chartData;
    const baseOptions: any = {
      title: customOptions.title || {},
      tooltip: {
        trigger: type === 'pie' ? 'item' : 'axis'
      },
      legend: {
        orient: 'horizontal',
        bottom: 10,
        ...customOptions.legend
      },
      animation: true,
      ...customOptions
    };

    // 根据主题设置配色
    if (theme === 'dark') {
      baseOptions.backgroundColor = '#1e1e1e';
      baseOptions.textStyle = { color: '#e0e0e0' };
      baseOptions.legend.textStyle = { color: '#e0e0e0' };
    }

    switch (type) {
      case 'pie': {
        // Chart.js饼图数据转换为ECharts格式
        const dataset = datasets?.[0];
        return {
          ...baseOptions,
          series: [
            {
              type: 'pie',
              radius: '60%',
              data: labels?.map((label, index) => ({
                name: label,
                value: dataset?.data[index] || 0
              })),
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        };
      }

      case 'bar': {
        // Chart.js柱状图数据转换为ECharts格式
        return {
          ...baseOptions,
          xAxis: {
            type: 'category',
            data: labels,
            ...customOptions.xAxis
          },
          yAxis: {
            type: 'value',
            ...customOptions.yAxis
          },
          series: datasets?.map(dataset => ({
            name: dataset.label,
            type: 'bar',
            data: dataset.data,
            emphasis: {
              focus: 'series'
            }
          }))
        };
      }

      case 'line': {
        // Chart.js折线图数据转换为ECharts格式
        return {
          ...baseOptions,
          xAxis: {
            type: 'category',
            data: labels,
            ...customOptions.xAxis
          },
          yAxis: {
            type: 'value',
            ...customOptions.yAxis
          },
          series: datasets?.map(dataset => ({
            name: dataset.label,
            type: 'line',
            data: dataset.data,
            smooth: dataset.tension ? true : false,
            showSymbol: customOptions.showSymbol !== undefined ? customOptions.showSymbol : true,
            emphasis: {
              focus: 'series'
            }
          }))
        };
      }

      case 'area': {
        // Chart.js面积图（实际上是填充区域的折线图）
        return {
          ...baseOptions,
          xAxis: {
            type: 'category',
            data: labels,
            ...customOptions.xAxis
          },
          yAxis: {
            type: 'value',
            ...customOptions.yAxis
          },
          series: datasets?.map(dataset => ({
            name: dataset.label,
            type: 'line',
            data: dataset.data,
            areaStyle: {},
            smooth: dataset.tension ? true : false,
            emphasis: {
              focus: 'series'
            }
          }))
        };
      }

      case 'scatter': {
        // 将Chart.js散点图数据转换为ECharts格式
        // 注意：Chart.js和ECharts对散点图数据格式要求不同
        return {
          ...baseOptions,
          xAxis: {
            type: 'value',
            ...customOptions.xAxis
          },
          yAxis: {
            type: 'value',
            ...customOptions.yAxis
          },
          series: datasets?.map(dataset => {
            // 对于散点图，需要将一维数组转换为二维坐标点
            const scatterData = dataset.data.map((value, index) => {
              // 如果数据已经是[x,y]格式，则直接使用
              if (Array.isArray(value)) {
                return value;
              }
              // 否则，使用索引作为x坐标
              return [index, value];
            });

            return {
              name: dataset.label,
              type: 'scatter',
              data: scatterData,
              emphasis: {
                focus: 'series'
              }
            };
          })
        };
      }

      case 'radar': {
        // 将Chart.js雷达图数据转换为ECharts格式
        const indicator = labels?.map(label => ({
          name: label,
          max: customOptions.maxValue || Math.max(...datasets?.flatMap(d => d.data) || [100]) * 1.2
        }));

        return {
          ...baseOptions,
          radar: {
            indicator,
            ...customOptions.radar
          },
          series: [
            {
              type: 'radar',
              data: datasets?.map(dataset => ({
                value: dataset.data,
                name: dataset.label,
                areaStyle: dataset.fill ? {} : undefined
              }))
            }
          ]
        };
      }

      default:
        return baseOptions;
    }
  };

  useEffect(() => {
    // 创建图表实例
    if (chartRef.current) {
      if (!chartInstance.current) {
        chartInstance.current = echarts.init(chartRef.current, theme);
      }

      // 转换数据并设置选项
      const echartsOption = convertToEChartsOption(chartType, data, options);
      chartInstance.current.setOption(echartsOption, true);
    }

    // 响应窗口调整大小事件
    const handleResize = () => {
      chartInstance.current?.resize();
    };
    window.addEventListener('resize', handleResize);

    // 清理函数
    return () => {
      window.removeEventListener('resize', handleResize);
      chartInstance.current?.dispose();
      chartInstance.current = null;
    };
  }, [chartType, data, options, theme]);

  useEffect(() => {
    // 当容器大小变化时调整图表大小
    chartInstance.current?.resize();
  }, [width, height]);

  return <div ref={chartRef} style={{ width, height }} />;
};

export default ChartRenderer;
