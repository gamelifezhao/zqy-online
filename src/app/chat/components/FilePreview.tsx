'use client';

import { useState } from 'react';
import { Card, Button, Tag, Typography, Space, Modal, List, Table } from 'antd';
import { 
  FileOutlined,
  FileTextOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  FileImageOutlined,
  FileZipOutlined,
  FileUnknownOutlined,
  DownloadOutlined,
  EyeOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import { Attachment, FileType } from '../types';
import CodeBlock from './CodeBlock';

const { Text, Title } = Typography;

interface FilePreviewProps {
  file: Attachment;
  onDelete?: (fileId: string) => void;
}

export default function FilePreview({ file, onDelete }: FilePreviewProps) {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewContent, setPreviewContent] = useState<any>(null);

  // 获取文件图标
  const getFileIcon = (fileType: FileType) => {
    switch (fileType) {
      case 'text':
        return <FileTextOutlined />;
      case 'spreadsheet':
        return <FileExcelOutlined />;
      case 'pdf':
        return <FilePdfOutlined />;
      case 'image':
        return <FileImageOutlined />;
      case 'archive':
        return <FileZipOutlined />;
      default:
        return <FileUnknownOutlined />;
    }
  };

  // 获取文件类型标签颜色
  const getFileTagColor = (fileType: FileType): string => {
    switch (fileType) {
      case 'text':
        return 'blue';
      case 'code':
        return 'purple';
      case 'spreadsheet':
        return 'green';
      case 'pdf':
        return 'red';
      case 'image':
        return 'cyan';
      case 'archive':
        return 'orange';
      default:
        return 'default';
    }
  };

  // 打开预览
  const openPreview = () => {
    // 这里可以扩展为实际从服务器获取文件内容
    if (file.contentPreview) {
      setPreviewContent(file.contentPreview);
      setPreviewVisible(true);
    } else {
      // 模拟文件内容
      if (file.type === 'text' || file.type === 'code') {
        setPreviewContent('这是文件的示例内容。实际使用时，这里会显示从服务器获取的真实文件内容。');
      } else if (file.type === 'spreadsheet') {
        // 模拟电子表格数据
        const mockData = Array.from({ length: 5 }, (_, i) => ({
          key: i,
          name: `项目 ${i + 1}`,
          value: Math.floor(Math.random() * 1000),
          trend: Math.random() > 0.5 ? '上升' : '下降',
        }));
        
        setPreviewContent(mockData);
      }
      setPreviewVisible(true);
    }
  };

  // 下载文件
  const downloadFile = () => {
    if (file.url) {
      const link = document.createElement('a');
      link.href = file.url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // 渲染预览内容
  const renderPreviewContent = () => {
    if (!previewContent) return null;

    if (file.type === 'text') {
      return <Text>{previewContent}</Text>;
    } else if (file.type === 'code') {
      return <CodeBlock code={previewContent} language={file.format || 'plaintext'} />;
    } else if (file.type === 'spreadsheet') {
      return (
        <Table 
          dataSource={previewContent} 
          columns={[
            {
              title: '名称',
              dataIndex: 'name',
              key: 'name',
            },
            {
              title: '数值',
              dataIndex: 'value',
              key: 'value',
            },
            {
              title: '趋势',
              dataIndex: 'trend',
              key: 'trend',
              render: (text) => (
                <Tag color={text === '上升' ? 'green' : 'red'}>
                  {text}
                </Tag>
              ),
            },
          ]}
          size="small"
          pagination={false}
        />
      );
    } else if (file.type === 'pdf') {
      return (
        <div className="flex justify-center">
          <div className="bg-gray-100 p-4 rounded-lg text-center">
            <FilePdfOutlined style={{ fontSize: 48, color: '#ff4d4f' }} />
            <Text>PDF预览需要PDF查看器支持</Text>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="mb-2">
      <Card 
        size="small" 
        className="file-preview-card hover:shadow-md transition-shadow"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="mr-3 text-xl">
              {getFileIcon(file.type)}
            </div>
            <div>
              <Text ellipsis style={{ maxWidth: 180 }} title={file.name}>
                {file.name}
              </Text>
              <div className="flex items-center mt-1">
                <Tag color={getFileTagColor(file.type)}>
                  {file.format ? file.format.toUpperCase() : file.type}
                </Tag>
                <Text type="secondary" className="text-xs">
                  {file.size}
                </Text>
              </div>
            </div>
          </div>

          <Space>
            <Button 
              type="text"
              icon={<EyeOutlined />}
              onClick={openPreview}
              title="预览"
              size="small"
            />
            <Button 
              type="text"
              icon={<DownloadOutlined />}
              onClick={downloadFile}
              title="下载"
              size="small"
            />
            {onDelete && (
              <Button 
                type="text" 
                danger 
                icon={<DeleteOutlined />}
                onClick={() => onDelete(file.id)}
                title="删除"
                size="small"
              />
            )}
          </Space>
        </div>
      </Card>

      <Modal
        title={file.name}
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={[
          <Button key="download" icon={<DownloadOutlined />} onClick={downloadFile}>
            下载
          </Button>,
          <Button key="close" onClick={() => setPreviewVisible(false)}>
            关闭
          </Button>
        ]}
        width={800}
      >
        <div className="p-4 max-h-[500px] overflow-auto">
          {renderPreviewContent()}
        </div>
      </Modal>
    </div>
  );
}
