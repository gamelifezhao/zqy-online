'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, Spin, Alert, Dropdown, Menu, Button, Tooltip } from 'antd';
import {
  DownloadOutlined,
  BarChartOutlined,
  LineChartOutlined,
  PieChartOutlined,
  SettingOutlined,
  ReloadOutlined,
  AreaChartOutlined,
  DotChartOutlined,
  RadarChartOutlined
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts/core';

interface ChartRendererProps {
  chartData: string;
  refreshInterval?: number; // 自动刷新间隔（毫秒）
  onRefresh?: () => void; // 刷新回调
}

export default function ChartRenderer({ chartData, refreshInterval, onRefresh }: ChartRendererProps) {
  const [parsed, setParsed] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState<string>('bar');
  const [echartsInstance, setEchartsInstance] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  // 解析图表数据
  useEffect(() => {
    try {
      console.log('Chart data received:', chartData);

      // 处理字符串类型的数据
      let jsonStr = chartData;
      if (typeof chartData === 'string') {
        // 检查是否包含在代码块中
        if (chartData.includes('```')) {
          // 使用字符串操作提取JSON，而不是正则表达式
          const startMarkers = ['```chart', '```json', '```'];
          let startIndex = -1;
          let endIndex = -1;

          // 查找起始标记
          for (const marker of startMarkers) {
            const index = chartData.indexOf(marker);
            if (index !== -1) {
              startIndex = index + marker.length;
              break;
            }
          }

          // 找到起始标记后，查找结束标记
          if (startIndex !== -1) {
            endIndex = chartData.indexOf('```', startIndex);

            if (endIndex !== -1) {
              // 提取JSON字符串并去除首尾空白
              jsonStr = chartData.substring(startIndex, endIndex).trim();
              console.log('Extracted JSON from code block:', jsonStr);
            }
          }
        }

        // 尝试检测JSON内容是否被多余的空行或其他字符包围
        if (jsonStr.includes('{') && jsonStr.includes('}')) {
          const firstBrace = jsonStr.indexOf('{');
          const lastBrace = jsonStr.lastIndexOf('}') + 1;
          if (firstBrace > 0 || lastBrace < jsonStr.length) {
            jsonStr = jsonStr.substring(firstBrace, lastBrace);
            console.log('Cleaned JSON string:', jsonStr);
          }
        }
      }

      // 处理可能已经是对象的情况
      const parsedData = typeof jsonStr === 'string' ? JSON.parse(jsonStr) : jsonStr;
      console.log('Parsed chart data:', parsedData);

      setParsed(parsedData);
      setChartType(parsedData.type || 'bar');
      setError(null);
    } catch (err) {
      console.error('Failed to parse chart data:', err);
      setError('图表数据格式无效，无法渲染');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [chartData]);

  // 自动刷新功能
  useEffect(() => {
    if (!refreshInterval || !onRefresh) return;

    const timer = setInterval(() => {
      handleRefreshData();
    }, refreshInterval);

    return () => clearInterval(timer);
  }, [refreshInterval, onRefresh]);

  // 获取图表主题色
  const getChartColors = (count: number) => {
    const baseColors = [
      '#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de',
      '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'
    ];

    // 如果需要的颜色多于基础颜色，则循环使用
    return Array.from({ length: count }, (_, i) => baseColors[i % baseColors.length]);
  };

  // 获取ECharts配置
  const getEChartsOption = () => {
    if (!parsed) return {};

    // 通用配置
    const commonConfig = {
      title: {
        left: 'center'
      },
      toolbox: {
        feature: {
          saveAsImage: { show: true, title: '保存为图片' },
        }
      }
    };

    // 根据不同图表类型生成不同配置
    switch (chartType) {
      case 'bar':
        return {
          ...commonConfig,
          tooltip: {
            trigger: 'axis' as const,
            axisPointer: {
              type: 'shadow' as const
            }
          },
          legend: {
            top: '10%',
            orient: 'horizontal' as const,
            data: (parsed.data?.datasets || []).map((d: any) => d.label)
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            top: '20%',
            containLabel: true
          },
          xAxis: {
            type: 'category' as const,
            data: parsed.data?.labels || []
          },
          yAxis: {
            type: 'value' as const
          },
          series: (parsed.data?.datasets || []).map((dataset: any) => ({
            name: dataset.label,
            type: 'bar' as const,
            data: dataset.data,
            itemStyle: {
              color: dataset.backgroundColor || getChartColors(1)[0]
            }
          }))
        };

      case 'line':
        return {
          ...commonConfig,
          tooltip: {
            trigger: 'axis' as const
          },
          legend: {
            top: '10%',
            orient: 'horizontal' as const,
            data: (parsed.data?.datasets || []).map((d: any) => d.label)
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            top: '20%',
            containLabel: true
          },
          xAxis: {
            type: 'category' as const,
            boundaryGap: false,
            data: parsed.data?.labels || []
          },
          yAxis: {
            type: 'value' as const
          },
          series: (parsed.data?.datasets || []).map((dataset: any) => ({
            name: dataset.label,
            type: 'line' as const,
            data: dataset.data,
            itemStyle: {
              color: dataset.borderColor || getChartColors(1)[0]
            },
            lineStyle: {
              width: 2,
              color: dataset.borderColor || getChartColors(1)[0]
            },
            areaStyle: dataset.fill ? {
              opacity: 0.3,
              color: dataset.backgroundColor || getChartColors(1)[0]
            } : undefined
          }))
        };

      case 'pie':
        const pieData = parsed.data?.labels?.map((label: string, index: number) => {
          const dataset = parsed.data.datasets[0];
          return {
            name: label,
            value: dataset.data[index],
            itemStyle: {
              color: Array.isArray(dataset.backgroundColor)
                ? dataset.backgroundColor[index]
                : getChartColors(parsed.data.labels.length)[index]
            }
          };
        }) || [];

        return {
          ...commonConfig,
          tooltip: {
            trigger: 'item' as const,
            formatter: '{a} <br/>{b}: {c} ({d}%)'
          },
          legend: {
            top: '10%',
            orient: 'horizontal' as const,
            data: parsed.data?.labels || []
          },
          series: [
            {
              name: parsed.data?.datasets?.[0]?.label || '数据',
              type: 'pie' as const,
              radius: '55%',
              center: ['50%', '60%'],
              data: pieData,
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

      case 'scatter':
        return {
          ...commonConfig,
          tooltip: {
            trigger: 'item' as const
          },
          xAxis: {
            type: 'value' as const
          },
          yAxis: {
            type: 'value' as const
          },
          series: (parsed.data?.datasets || []).map((dataset: any) => {
            // 将数据转换为[x,y]格式
            const scatterData = dataset.data.map((value: any, i: number) => {
              // 如果数据已经是[x,y]格式，直接使用
              if (Array.isArray(value)) return value;
              // 否则使用索引作为x坐标
              return [i, value];
            });

            return {
              name: dataset.label,
              type: 'scatter' as const,
              data: scatterData,
              itemStyle: {
                color: dataset.backgroundColor || getChartColors(1)[0]
              }
            };
          })
        };

      case 'area':
        return {
          ...commonConfig,
          tooltip: {
            trigger: 'axis' as const
          },
          legend: {
            top: '10%',
            orient: 'horizontal' as const,
            data: (parsed.data?.datasets || []).map((d: any) => d.label)
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            top: '20%',
            containLabel: true
          },
          xAxis: {
            type: 'category' as const,
            boundaryGap: false,
            data: parsed.data?.labels || []
          },
          yAxis: {
            type: 'value' as const
          },
          series: (parsed.data?.datasets || []).map((dataset: any) => ({
            name: dataset.label,
            type: 'line' as const,
            data: dataset.data,
            areaStyle: {
              opacity: 0.5,
              color: dataset.backgroundColor || getChartColors(1)[0]
            },
            itemStyle: {
              color: dataset.borderColor || getChartColors(1)[0]
            },
            lineStyle: {
              width: 2,
              color: dataset.borderColor || getChartColors(1)[0]
            }
          }))
        };

      case 'radar':
        // 准备雷达图的指标
        const indicators = parsed.data?.labels?.map((label: string, index: number) => {
          // 找出该指标在所有数据集中的最大值
          const max = Math.max(...(parsed.data?.datasets || []).map((dataset: any) =>
            dataset.data[index] || 0
          ));
          return { name: label, max: max * 1.2 }; // 最大值稍微大一点，便于显示
        }) || [];

        // 准备雷达图的数据
        const radarSeries = (parsed.data?.datasets || []).map((dataset: any) => ({
          name: dataset.label,
          type: 'radar' as const,
          data: [{
            value: dataset.data,
            name: dataset.label
          }],
          itemStyle: {
            color: dataset.backgroundColor || getChartColors(1)[0]
          },
          areaStyle: {
            opacity: 0.3
          }
        }));

        return {
          ...commonConfig,
          tooltip: {
            trigger: 'item' as const
          },
          legend: {
            top: '10%',
            orient: 'horizontal' as const,
            data: (parsed.data?.datasets || []).map((d: any) => d.label)
          },
          radar: {
            indicator: indicators,
            shape: 'circle',
            splitNumber: 5,
            center: ['50%', '60%'],
            radius: '65%'
          },
          series: radarSeries
        };

      default:
        return {
          ...commonConfig,
          tooltip: {
            trigger: 'axis' as const
          },
          xAxis: {
            type: 'category' as const,
            data: parsed.data?.labels || []
          },
          yAxis: {
            type: 'value' as const
          },
          series: (parsed.data?.datasets || []).map((dataset: any) => ({
            name: dataset.label,
            type: chartType as any,
            data: dataset.data
          }))
        };
    }
  };

  // 下载图表为图片
  const handleDownloadChart = () => {
    if (!echartsInstance) return;

    const dataURL = echartsInstance.getEchartsInstance().getDataURL({
      type: 'png',
      pixelRatio: 2,
      backgroundColor: '#fff'
    });

    const link = document.createElement('a');
    link.download = `chart-${Date.now()}.png`;
    link.href = dataURL;
    link.click();
  };

  // 刷新数据
  const handleRefreshData = useCallback(() => {
    if (refreshing || !onRefresh) return;

    setRefreshing(true);
    onRefresh();
  }, [onRefresh, refreshing]);



  // 获取ECharts实例
  const onChartReady = (instance: any) => {
    setEchartsInstance(instance);
  };



  if (loading) {
    return <Spin tip="加载图表中..." />;
  }

  if (error) {
    return <Alert message="图表渲染错误" description={error} type="error" />;
  }

  return (
    <Card
      className="mb-4"
      style={{ minWidth: '300px', width: '100%' }}
    >
      <div className="w-full h-80" style={{ minWidth: '280px', minHeight: '300px' }}>
        <ReactECharts
          option={getEChartsOption()}
          style={{ height: '100%', width: '100%' }}
          notMerge={true}
          lazyUpdate={true}
          onChartReady={onChartReady}
          opts={{ renderer: 'canvas' }}
        />
      </div>
      {parsed?.description && (
        <div className="mt-4 text-sm text-gray-500">
          {parsed.description}
        </div>
      )}
    </Card>
  );
}
