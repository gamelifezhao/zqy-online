'use client';

import React, { useState } from 'react';
import { Upload, Button, message, Progress, Card, Modal, Spin, Select, Checkbox, Radio, Form, Input, Divider } from 'antd';
import { InboxOutlined, FileOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import { Document } from '../types';
import { useKnowledgeBase } from '../page';

const { Dragger } = Upload;
const { Option } = Select;

// 模拟文件上传进度
const simulateProgress = (file: UploadFile, onProgress: (percent: number) => void) => {
  let percent = 0;
  const interval = setInterval(() => {
    percent += Math.floor(Math.random() * 10);
    if (percent >= 100) {
      percent = 100;
      clearInterval(interval);
    }
    onProgress(percent);
  }, 300);
  
  return interval;
};

interface FileUploaderProps {
  visible: boolean;
  onClose: () => void;
  onUploadComplete: (docs: Document[]) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ visible, onClose, onUploadComplete }) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewFile, setPreviewFile] = useState<UploadFile | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<string>('');
  const [processingOptions, setProcessingOptions] = useState<string[]>([]);
  const [form] = Form.useForm();

  // 场景选项
  const scenarioOptions = [
    { value: 'customer-service', label: '智能客服系统', desc: '上传客服知识库文档、FAQ和用户指南' },
    { value: 'dashboard', label: '动态数据仪表板', desc: '上传报表、数据集和可视化配置' },
    { value: 'doc-generation', label: '自动化文档生成', desc: '上传模板文档和数据源' },
    { value: 'data-pipeline', label: '实时数据分析管道', desc: '上传数据处理脚本和配置文件' }
  ];

  // 场景特定的处理选项
  const getProcessingOptions = (scenario: string) => {
    switch (scenario) {
      case 'customer-service':
        return [
          { value: 'extract-faqs', label: '自动提取常见问题' },
          { value: 'generate-responses', label: '生成标准回复' },
          { value: 'intent-recognition', label: '识别用户意图' }
        ];
      case 'dashboard':
        return [
          { value: 'extract-metrics', label: '提取关键指标' },
          { value: 'auto-visualize', label: '自动创建可视化' },
          { value: 'trend-analysis', label: '执行趋势分析' }
        ];
      case 'doc-generation':
        return [
          { value: 'template-extraction', label: '提取模板结构' },
          { value: 'variable-mapping', label: '变量映射' },
          { value: 'format-preservation', label: '保留格式特性' }
        ];
      case 'data-pipeline':
        return [
          { value: 'schema-validation', label: '验证数据模式' },
          { value: 'optimized-parsing', label: '优化解析策略' },
          { value: 'incremental-processing', label: '增量处理' }
        ];
      default:
        return [];
    }
  };

  // 处理场景变化
  const handleScenarioChange = (value: string) => {
    setSelectedScenario(value);
    setProcessingOptions([]);
    form.setFieldsValue({ processingOptions: [] });
  };

  // 处理处理选项变化
  const handleProcessingOptionsChange = (values: string[]) => {
    setProcessingOptions(values);
  };

  // 文件类型到Document类型的映射
  const getDocumentType = (fileName: string): Document['type'] => {
    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    
    if (extension === 'pdf') return 'pdf';
    if (['doc', 'docx'].includes(extension)) return 'docx';
    if (['xls', 'xlsx'].includes(extension)) return 'xlsx';
    if (['ppt', 'pptx'].includes(extension)) return 'pptx';
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension)) return 'image';
    if (['txt', 'md', 'rtf'].includes(extension)) return 'txt';
    
    return 'other';
  };

  // 处理文件变化
  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    // 更新文件列表
    setFileList(newFileList);
  };

  // 自定义上传实现
  const customRequest = (options: any) => {
    const { file, onProgress, onSuccess, onError } = options;
    
    // 模拟文件上传进度
    const progressInterval = simulateProgress(file, (percent) => {
      file.percent = percent;
      onProgress({ percent });
      setFileList([...fileList]);
    });
    
    // 模拟上传完成
    setTimeout(() => {
      clearInterval(progressInterval);
      onSuccess("上传成功");
    }, 3000 + Math.random() * 3000); // 随机3-6秒完成上传
    
    return {
      abort() {
        clearInterval(progressInterval);
        message.warning(`${file.name} 上传已取消`);
      }
    };
  };

  // 开始上传所有文件
  const handleUpload = async () => {
    if (fileList.length === 0) {
      message.warning('请先选择要上传的文件');
      return;
    }
    
    try {
      // 验证表单
      await form.validateFields();
      
      setUploading(true);
      
      // 这里模拟文件处理过程
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 获取表单数据
      const formData = form.getFieldsValue();
      
      // 创建Document对象
      const newDocuments: Document[] = fileList.map(file => ({
        id: `doc-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        name: file.name || 'Unnamed Document',
        type: getDocumentType(file.name || ''),
        size: file.size || 0,
        uploadDate: new Date().toISOString(),
        status: 'processing', // 初始状态为处理中
        groupId: selectedScenario || 'default',
        tags: [
          ...(selectedScenario ? [scenarioOptions.find(s => s.value === selectedScenario)?.label || ''] : []),
          ...(formData.tags ? formData.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean) : [])
        ],
        description: formData.description || '',
        usageStats: {
          searchCount: 0,
          hitRate: 0
        }
      }));
      
      // 显示上传成功消息
      let successMessage = `成功上传 ${fileList.length} 个文件！`;
      if (selectedScenario) {
        successMessage += ` 应用场景: ${scenarioOptions.find(s => s.value === selectedScenario)?.label}`;
      }
      if (processingOptions.length > 0) {
        successMessage += `, 已启用 ${processingOptions.length} 个处理选项`;
      }
      
      message.success(successMessage);
      onUploadComplete(newDocuments);
      
      // 重置状态
      setFileList([]);
      setUploading(false);
      setSelectedScenario('');
      setProcessingOptions([]);
      form.resetFields();
      onClose();
      
    } catch (error) {
      if (error instanceof Error) {
        message.error('表单验证失败: ' + error.message);
      } else {
        message.error('上传过程中发生错误');
      }
      setUploading(false);
    }
  };

  // 删除文件
  const handleRemove = (file: UploadFile) => {
    const newFileList = fileList.filter(item => item.uid !== file.uid);
    setFileList(newFileList);
  };

  // 预览文件
  const handlePreview = (file: UploadFile) => {
    setPreviewFile(file);
    setPreviewVisible(true);
  };

  // 渲染预览内容
  const renderPreviewContent = () => {
    if (!previewFile) return null;
    
    const { type } = previewFile;
    const url = previewFile.url || previewFile.thumbUrl || '';
    
    if (type?.startsWith('image/')) {
      return <img alt={previewFile.name} style={{ width: '100%' }} src={url} />;
    }
    
    if (type === 'application/pdf') {
      return <iframe title="pdf-preview" style={{ width: '100%', height: '70vh' }} src={url} />;
    }
    
    return (
      <div className="text-center p-10">
        <FileOutlined style={{ fontSize: 64, color: '#1890ff' }} />
        <p className="mt-4">无法预览此文件类型</p>
      </div>
    );
  };

  return (
    <>
      <Modal
        title="上传文档"
        open={visible}
        onCancel={onClose}
        width={800}
        footer={[
          <Button key="cancel" onClick={onClose}>
            取消
          </Button>,
          <Button
            key="upload"
            type="primary"
            onClick={handleUpload}
            loading={uploading}
            disabled={fileList.length === 0}
          >
            {uploading ? '处理中...' : '开始上传'}
          </Button>,
        ]}
      >
        <Spin spinning={uploading} tip="文件处理中...">
          <Form form={form} layout="vertical">
            {/* 应用场景选择 */}
            <Form.Item 
              label="选择应用场景" 
              name="scenario"
              rules={[{ required: true, message: '请选择应用场景' }]}
            >
              <Select 
                placeholder="选择此批文档的应用场景" 
                onChange={handleScenarioChange}
                value={selectedScenario}
                style={{ width: '100%' }}
              >
                {scenarioOptions.map(option => (
                  <Option key={option.value} value={option.value}>
                    <div>
                      <div>{option.label}</div>
                      <div className="text-xs text-gray-500">{option.desc}</div>
                    </div>
                  </Option>
                ))}
              </Select>
            </Form.Item>
            
            {/* 场景特定处理选项 */}
            {selectedScenario && (
              <Form.Item label="处理选项" name="processingOptions">
                <Checkbox.Group 
                  options={getProcessingOptions(selectedScenario).map(opt => ({ 
                    label: opt.label, 
                    value: opt.value 
                  }))} 
                  onChange={handleProcessingOptionsChange as any}
                />
              </Form.Item>
            )}
            
            <Divider />
            
            {/* 文件上传区域 */}
            <Dragger
              multiple
              fileList={fileList}
              onChange={handleChange}
              customRequest={customRequest}
              showUploadList={false}
              disabled={uploading}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">点击或拖拽文件到此区域进行上传</p>
              <p className="ant-upload-hint">
                支持单个或批量上传，可一次性选择多个文件。支持PDF、Word、Excel、PPT、图片等多种格式。
                {selectedScenario === 'customer-service' && ' 推荐上传FAQ文档、知识库文章和用户指南。'}
                {selectedScenario === 'dashboard' && ' 推荐上传数据报表、Excel表格和配置文件。'}
                {selectedScenario === 'doc-generation' && ' 推荐上传文档模板和示例文件。'}
                {selectedScenario === 'data-pipeline' && ' 推荐上传数据集、脚本和配置文件。'}
              </p>
            </Dragger>

            {/* 文件列表 */}
            <div className="mt-4 space-y-2">
              {fileList.map(file => (
                <Card 
                  key={file.uid} 
                  size="small" 
                  style={{ marginBottom: 8 }}
                  actions={[
                    <EyeOutlined key="preview" onClick={() => handlePreview(file)} />,
                    <DeleteOutlined key="delete" onClick={() => handleRemove(file)} />
                  ]}
                >
                  <div className="flex items-center">
                    <FileOutlined className="mr-2" />
                    <div className="flex-1 overflow-hidden">
                      <div className="text-sm truncate">{file.name}</div>
                      <Progress percent={file.percent || 0} size="small" status={file.status === 'error' ? 'exception' : undefined} />
                    </div>
                    <div className="text-xs text-gray-500">
                      {(file.size && file.size / 1024 > 1024)
                        ? `${(file.size / 1024 / 1024).toFixed(2)} MB`
                        : `${(file.size ? (file.size / 1024).toFixed(2) : 0)} KB`}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            
            <Divider />
            
            {/* 额外信息 */}
            <Form.Item label="描述" name="description">
              <Input.TextArea rows={2} placeholder="为这批文档添加描述信息" />
            </Form.Item>
            
            <Form.Item label="标签" name="tags">
              <Input placeholder="输入标签，用逗号分隔" />
            </Form.Item>
          </Form>
        </Spin>
      </Modal>

      {/* 文件预览弹窗 */}
      <Modal
        open={previewVisible}
        title={previewFile?.name || '文件预览'}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
        width={800}
      >
        {renderPreviewContent()}
      </Modal>
    </>
  );
};

export default FileUploader;
