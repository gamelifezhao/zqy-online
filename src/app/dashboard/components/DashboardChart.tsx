'use client';

import React, { useState, useEffect, useRef } from 'react';
import ReactECharts from 'echarts-for-react';
import { Spin, Empty, Card, Button, Dropdown, Menu } from 'antd';
import { DownloadOutlined, BarChartOutlined, LineChartOutlined, PieChartOutlined, AreaChartOutlined, DotChartOutlined, RadarChartOutlined } from '@ant-design/icons';
import type { EChartsOption } from 'echarts';

// 图表类型
export type ChartType = 'bar' | 'line' | 'pie' | 'scatter' | 'area' | 'radar';

// 图表数据接口
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    fill?: boolean;
  }[];
}

// 图表配置接口
export interface ChartOptions {
  title?: string;
  yAxisLabel?: string;
  xAxisLabel?: string;
  stacked?: boolean;
  scale?: {
    min?: number;
    max?: number;
  };
}

// 图表组件属性
interface DashboardChartProps {
  type: ChartType;
  data: ChartData;
  options?: ChartOptions;
  height?: number | string;
  loading?: boolean;
  className?: string;
  allowTypeChange?: boolean;
}

// 处理颜色值，确保兼容ECharts
const processColor = (color: string | string[] | undefined): string => {
  if (!color) return '#1890ff';
  
  if (Array.isArray(color)) {
    return color[0] || '#1890ff';
  }
  
  return color;
};

// 获取图表主题色
const getChartColors = (count: number) => {
  const baseColors = [
    '#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de',
    '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'
  ];

  // 如果需要的颜色多于基础颜色，则循环使用
  return Array.from({ length: count }, (_, i) => baseColors[i % baseColors.length]);
};

// 生成完整的ECharts配置
const generateEChartsOptions = (type: ChartType, data: ChartData, options: ChartOptions = {}): EChartsOption => {
  // 通用配置
  const commonConfig: EChartsOption = {
    title: options.title ? {
      text: options.title,
      left: 'center',
      top: 0,
      textStyle: {
        fontSize: 16,
        fontWeight: 'normal'
      }
    } : undefined,
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderColor: '#e6e9ed',
      borderWidth: 1,
      textStyle: {
        color: '#333'
      },
      axisPointer: {
        type: 'shadow'
      }
    },
    toolbox: {
      feature: {
        saveAsImage: { 
          title: '保存为图片',
          pixelRatio: 2
        }
      },
      right: 10,
      top: 5
    },
    legend: {
      data: data.datasets.map(d => d.label),
      bottom: 0,
      icon: 'circle',
      itemWidth: 10,
      itemHeight: 10,
      textStyle: {
        fontSize: 12
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: options.title ? '15%' : '8%',
      containLabel: true
    },
    color: getChartColors(data.datasets.length)
  };

  // 根据图表类型生成特定配置
  switch (type) {
    case 'bar': {
      return {
        ...commonConfig,
        xAxis: {
          type: 'category',
          data: data.labels,
          axisLabel: {
            fontSize: 11,
            rotate: data.labels.length > 10 ? 45 : 0
          },
          axisTick: {
            alignWithLabel: true
          },
          name: options.xAxisLabel,
          nameLocation: 'middle',
          nameGap: 35
        },
        yAxis: {
          type: 'value',
          name: options.yAxisLabel,
          nameLocation: 'middle',
          nameGap: 50,
          nameTextStyle: {
            fontWeight: 'bold',
            padding: [0, 0, 15, 0]
          }
        },
        series: data.datasets.map(dataset => ({
          name: dataset.label,
          type: 'bar',
          barMaxWidth: 50,
          data: dataset.data,
          itemStyle: {
            color: Array.isArray(dataset.backgroundColor) 
              ? processColor(dataset.backgroundColor)
              : dataset.backgroundColor,
            borderRadius: [4, 4, 0, 0]
          },
          emphasis: {
            focus: 'series'
          },
          stack: options.stacked ? 'total' : undefined,
          label: options.stacked ? {
            show: false,
            position: 'inside'
          } : undefined
        }))
      };
    }

    case 'line': {
      return {
        ...commonConfig,
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: data.labels,
          axisLabel: {
            fontSize: 11,
            rotate: data.labels.length > 10 ? 45 : 0
          },
          name: options.xAxisLabel,
          nameLocation: 'middle',
          nameGap: 35
        },
        yAxis: {
          type: 'value',
          name: options.yAxisLabel,
          nameLocation: 'middle',
          nameGap: 50,
          nameTextStyle: {
            fontWeight: 'bold',
            padding: [0, 0, 15, 0]
          },
          scale: true
        },
        series: data.datasets.map(dataset => {
          const color = processColor(dataset.borderColor || dataset.backgroundColor);
          
          return {
            name: dataset.label,
            type: 'line',
            data: dataset.data,
            smooth: true,
            emphasis: {
              focus: 'series'
            },
            symbol: 'circle',
            symbolSize: 6,
            showSymbol: data.labels.length <= 20,
            lineStyle: {
              width: 3,
              color
            },
            itemStyle: {
              color
            },
            areaStyle: dataset.fill ? {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: processColor(dataset.backgroundColor)
                  },
                  {
                    offset: 1,
                    color: 'rgba(255, 255, 255, 0.1)'
                  }
                ]
              }
            } : undefined
          };
        })
      };
    }

    case 'area': {
      // 面积图基本上是填充的折线图
      const lineOptions = generateEChartsOptions('line', data, options) as any;
      
      // 确保所有序列都有面积样式
      lineOptions.series = lineOptions.series.map((series: any, index: number) => ({
        ...series,
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: processColor(data.datasets[index].backgroundColor)
              },
              {
                offset: 1,
                color: 'rgba(255, 255, 255, 0.1)'
              }
            ]
          }
        },
        stack: options.stacked ? 'total' : undefined,
        emphasis: {
          focus: 'series'
        }
      }));
      
      return lineOptions;
    }

    case 'pie': {
      // 为饼图准备数据
      const seriesData = data.datasets[0].data.map((value, index) => ({
        name: data.labels[index],
        value
      }));
      
      return {
        ...commonConfig,
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          bottom: 0,
          data: data.labels,
          icon: 'circle',
          itemWidth: 10,
          itemHeight: 10,
          textStyle: {
            fontSize: 12
          }
        },
        series: [{
          name: data.datasets[0].label,
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['50%', '45%'],
          avoidLabelOverlap: true,
          itemStyle: {
            borderRadius: 6,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 16,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: seriesData
        }]
      };
    }

    case 'scatter': {
      return {
        ...commonConfig,
        xAxis: {
          type: 'value',
          scale: true,
          name: options.xAxisLabel,
          nameLocation: 'middle',
          nameGap: 30
        },
        yAxis: {
          type: 'value',
          scale: true,
          name: options.yAxisLabel,
          nameLocation: 'middle',
          nameGap: 50,
          nameTextStyle: {
            fontWeight: 'bold',
            padding: [0, 0, 15, 0]
          }
        },
        series: data.datasets.map(dataset => {
          // 将数据转换为 [x, y] 格式
          const scatterData = dataset.data.map((value, index) => [index, value]);
          
          return {
            name: dataset.label,
            type: 'scatter',
            data: scatterData,
            symbolSize: 10,
            emphasis: {
              focus: 'series',
              itemStyle: {
                shadowBlur: 10,
                shadowColor: 'rgba(0, 0, 0, 0.3)'
              }
            }
          };
        })
      };
    }

    case 'radar': {
      // 为雷达图准备指示器
      const indicator = data.labels.map(label => ({
        name: label,
        max: options.scale?.max || 100
      }));
      
      return {
        ...commonConfig,
        tooltip: {
          trigger: 'item'
        },
        radar: {
          indicator,
          radius: '65%',
          center: ['50%', '50%'],
          splitNumber: 5,
          splitArea: {
            areaStyle: {
              color: ['rgba(250, 250, 250, 0.3)', 'rgba(200, 200, 200, 0.1)']
            }
          },
          axisName: {
            fontSize: 11
          }
        },
        series: [{
          type: 'radar',
          data: data.datasets.map(dataset => ({
            value: dataset.data,
            name: dataset.label,
            symbolSize: 6,
            lineStyle: {
              width: 3
            },
            areaStyle: {
              opacity: 0.2
            }
          }))
        }]
      };
    }

    default:
      return commonConfig;
  }
};

// 导出Dashboard图表组件
export default function DashboardChart({
  type: initialType,
  data,
  options = {},
  height = 350,
  loading = false,
  className = '',
  allowTypeChange = false
}: DashboardChartProps) {
  const [chartType, setChartType] = useState<ChartType>(initialType);
  const [chartInstance, setChartInstance] = useState<any>(null);
  const chartRef = useRef<ReactECharts>(null);

  // 当图表类型或数据变化时，更新图表
  useEffect(() => {
    if (chartInstance) {
      chartInstance.setOption(generateEChartsOptions(chartType, data, options));
    }
  }, [chartType, data, options, chartInstance]);

  // 保存图表实例的回调
  const onChartReady = (instance: any) => {
    setChartInstance(instance);
  };

  // 处理图表类型切换
  const handleChartTypeChange = (newType: ChartType) => {
    setChartType(newType);
  };

  // 渲染类型选择器
  const chartTypeSelector = allowTypeChange && (
    <div className="chart-type-selector">
      <div className="flex space-x-1">
        <Button 
          type={chartType === 'bar' ? 'primary' : 'text'} 
          icon={<BarChartOutlined />} 
          size="small"
          onClick={() => handleChartTypeChange('bar')}
          title="柱状图"
        />
        <Button 
          type={chartType === 'line' ? 'primary' : 'text'} 
          icon={<LineChartOutlined />} 
          size="small"
          onClick={() => handleChartTypeChange('line')}
          title="折线图"
        />
        <Button 
          type={chartType === 'area' ? 'primary' : 'text'} 
          icon={<AreaChartOutlined />} 
          size="small"
          onClick={() => handleChartTypeChange('area')}
          title="面积图"
        />
        <Button 
          type={chartType === 'pie' ? 'primary' : 'text'} 
          icon={<PieChartOutlined />} 
          size="small"
          onClick={() => handleChartTypeChange('pie')}
          title="饼图"
        />
        <Button 
          type={chartType === 'scatter' ? 'primary' : 'text'} 
          icon={<DotChartOutlined />} 
          size="small"
          onClick={() => handleChartTypeChange('scatter')}
          title="散点图"
        />
        <Button 
          type={chartType === 'radar' ? 'primary' : 'text'} 
          icon={<RadarChartOutlined />} 
          size="small"
          onClick={() => handleChartTypeChange('radar')}
          title="雷达图"
        />
      </div>
    </div>
  );

  // 生成图表配置
  const echartsOption = generateEChartsOptions(chartType, data, options);

  // 如果没有数据，显示空状态
  if (!data || !data.labels || !data.datasets || data.datasets.length === 0) {
    return (
      <div className={`dashboard-chart empty ${className}`} style={{ height }}>
        <Empty description="暂无数据" />
      </div>
    );
  }

  return (
    <div className={`dashboard-chart ${className}`}>
      {allowTypeChange && (
        <div className="chart-controls flex justify-end mb-2">
          {chartTypeSelector}
        </div>
      )}
      
      <Spin spinning={loading} tip="加载中...">
        <div style={{ height: typeof height === 'number' ? `${height}px` : height }}>
          <ReactECharts
            ref={chartRef}
            option={echartsOption}
            style={{ height: '100%', width: '100%' }}
            onChartReady={onChartReady}
            notMerge={true}
            lazyUpdate={true}
            theme="custom"
          />
        </div>
      </Spin>
    </div>
  );
}
