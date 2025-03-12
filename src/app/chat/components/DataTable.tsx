'use client';

import { useState, useEffect } from 'react';
import { Table, Button, Input, Card, Tooltip, Radio, Space } from 'antd';
import { 
  SearchOutlined, 
  DownloadOutlined, 
  ReloadOutlined, 
  BarChartOutlined,
  LineChartOutlined,
  PieChartOutlined,
  TableOutlined 
} from '@ant-design/icons';
import ChartRenderer from './ChartRenderer';

interface DataTableProps {
  data: Record<string, any>[]; // 表格数据
  title?: string; // 表格标题
  description?: string; // 表格描述
}

export default function DataTable({ data, title = "数据表格", description }: DataTableProps) {
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState<Record<string, any>[]>(data);
  const [chartType, setChartType] = useState<string | null>(null);
  const [chartData, setChartData] = useState<string | null>(null);

  // 更新数据时重置过滤
  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  // 提取表头
  const extractColumns = () => {
    if (data.length === 0) return [];

    return Object.keys(data[0]).map(key => ({
      title: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'), // 格式化标题
      dataIndex: key,
      key: key,
      sorter: (a: any, b: any) => {
        if (typeof a[key] === 'number') {
          return a[key] - b[key];
        }
        if (typeof a[key] === 'string') {
          return a[key].localeCompare(b[key]);
        }
        return 0;
      },
      render: (text: any) => {
        // 根据内容类型适当渲染
        if (typeof text === 'boolean') {
          return text ? '是' : '否';
        }
        if (text === null || text === undefined) {
          return '-';
        }
        return text;
      }
    }));
  };

  // 过滤数据
  const handleSearch = (value: string) => {
    setSearchText(value);
    
    if (!value) {
      setFilteredData(data);
      return;
    }
    
    const filtered = data.filter(item => {
      return Object.values(item).some(val => {
        if (val === null || val === undefined) return false;
        return String(val).toLowerCase().includes(value.toLowerCase());
      });
    });
    
    setFilteredData(filtered);
  };

  // 下载为CSV
  const downloadCSV = () => {
    const columns = Object.keys(data[0]);
    const header = columns.join(',');
    const rows = data.map(item => 
      columns.map(col => {
        const value = item[col];
        // 处理带逗号的字符串，使用双引号包围
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value}"`;
        }
        return value;
      }).join(',')
    );
    
    const csvContent = [header, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 生成图表数据
  const generateChartData = (type: string) => {
    if (data.length === 0) return;
    
    const columns = Object.keys(data[0]);
    // 寻找可能的数字列作为数据值
    const numericColumns = columns.filter(col => 
      typeof data[0][col] === 'number'
    );
    
    // 寻找可能的标签列（非数字列优先）
    const labelColumns = columns.filter(col => 
      typeof data[0][col] !== 'number'
    );
    
    if (numericColumns.length === 0) {
      alert('没有找到数字类型的列，无法生成图表');
      return;
    }
    
    const valueColumn = numericColumns[0]; // 使用第一个数字列
    const labelColumn = labelColumns.length > 0 ? labelColumns[0] : columns[0]; // 使用第一个非数字列作为标签
    
    // 提取数据
    const labels = data.map(item => String(item[labelColumn]));
    const values = data.map(item => item[valueColumn]);
    
    // 根据图表类型创建不同的配置
    let chartConfig: any = {
      type,
      title: `${title} - ${valueColumn}分析`,
      description: description || `基于${labelColumn}显示${valueColumn}的数据分布`,
      data: {
        labels,
        datasets: [
          {
            label: valueColumn,
            data: values,
            backgroundColor: [
              'rgba(54, 162, 235, 0.5)',
              'rgba(255, 99, 132, 0.5)',
              'rgba(75, 192, 192, 0.5)',
              'rgba(255, 206, 86, 0.5)',
              'rgba(153, 102, 255, 0.5)',
              'rgba(255, 159, 64, 0.5)',
              'rgba(199, 199, 199, 0.5)',
            ],
            borderColor: [
              'rgba(54, 162, 235, 1)',
              'rgba(255, 99, 132, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
              'rgba(199, 199, 199, 1)',
            ],
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      }
    };
    
    setChartType(type);
    setChartData(JSON.stringify(chartConfig, null, 2));
  };

  return (
    <Card 
      title={<span className="font-medium">{title}</span>}
      extra={
        <Space>
          <Input
            placeholder="搜索..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={e => handleSearch(e.target.value)}
            style={{ width: 200 }}
            allowClear
          />
          <Radio.Group 
            value={chartType} 
            onChange={e => generateChartData(e.target.value)}
            buttonStyle="solid"
            size="small"
          >
            <Tooltip title="表格视图">
              <Radio.Button value={null}><TableOutlined /></Radio.Button>
            </Tooltip>
            <Tooltip title="柱状图">
              <Radio.Button value="bar"><BarChartOutlined /></Radio.Button>
            </Tooltip>
            <Tooltip title="折线图">
              <Radio.Button value="line"><LineChartOutlined /></Radio.Button>
            </Tooltip>
            <Tooltip title="饼图">
              <Radio.Button value="pie"><PieChartOutlined /></Radio.Button>
            </Tooltip>
          </Radio.Group>
          <Tooltip title="下载CSV">
            <Button 
              icon={<DownloadOutlined />} 
              onClick={downloadCSV}
              size="small"
            />
          </Tooltip>
          <Tooltip title="重置筛选">
            <Button 
              icon={<ReloadOutlined />} 
              onClick={() => {
                setSearchText('');
                setFilteredData(data);
                setChartType(null);
              }}
              size="small"
            />
          </Tooltip>
        </Space>
      }
      className="mb-4 data-table-card"
    >
      {description && (
        <div className="mb-4 text-sm text-gray-500">
          {description}
        </div>
      )}
      
      {chartType && chartData ? (
        <ChartRenderer chartData={chartData} />
      ) : (
        <Table 
          dataSource={filteredData.map((item, index) => ({ ...item, key: index }))}
          columns={extractColumns()}
          pagination={{ 
            defaultPageSize: 5,
            showSizeChanger: true,
            pageSizeOptions: ['5', '10', '20', '50'],
            showTotal: (total) => `共 ${total} 条数据`
          }}
          size="middle"
          bordered
          scroll={{ x: 'max-content' }}
        />
      )}
    </Card>
  );
}
