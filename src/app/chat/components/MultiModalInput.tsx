'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  Input, 
  Button, 
  Upload, 
  Tooltip, 
  Popover, 
  Dropdown, 
  Menu, 
  message, 
  Modal, 
  Progress,
  Spin
} from 'antd';
import {
  SendOutlined,
  PictureOutlined,
  PaperClipOutlined,
  AudioOutlined,
  CodeOutlined,
  SettingOutlined,
  CloseCircleOutlined,
  UploadOutlined,
  LoadingOutlined,
  EditOutlined
} from '@ant-design/icons';
import { Attachment, VoiceInputState } from '../types';
import { generateId, getFileTypeFromMime } from '../utils';
import ImageEditor from './ImageEditor';

// 添加Web Speech API类型定义
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal?: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onaudioend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onaudiostart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onerror: ((this: SpeechRecognition, ev: Event) => any) | null;
  onnomatch: ((this: SpeechRecognition, ev: Event) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onsoundend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onsoundstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

const { TextArea } = Input;

interface MultiModalInputProps {
  onSendMessage: (content: string, contentType: 'text' | 'image' | 'audio' | 'video' | 'file' | 'code' | 'chart', attachments?: any[]) => void;
  scenario?: string;
}

export default function MultiModalInput({ onSendMessage, scenario }: MultiModalInputProps) {
  const [text, setText] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recordingError, setRecordingError] = useState<string | null>(null);
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [codeContent, setCodeContent] = useState('');
  const [codeLanguage, setCodeLanguage] = useState('javascript');
  const [showImageEditor, setShowImageEditor] = useState(false);
  const [currentEditingImage, setCurrentEditingImage] = useState<Attachment | null>(null);
  
  const textAreaRef = useRef<any>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // 检测浏览器是否支持语音识别
  const isSpeechRecognitionSupported = typeof window !== 'undefined' && 
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  // 初始化语音识别
  useEffect(() => {
    if (isSpeechRecognitionSupported) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'zh-CN';

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        setTranscript(transcript);
        setText(prevText => prevText + transcript);
      };

      recognitionRef.current.onerror = (event: Event) => {
        setRecordingError(`语音识别错误: ${event.type}`);
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [isSpeechRecognitionSupported]);

  // 处理语音输入
  const handleVoiceInput = () => {
    if (!isSpeechRecognitionSupported) {
      message.error('您的浏览器不支持语音识别功能');
      return;
    }

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      setRecordingError(null);
      recognitionRef.current?.start();
      setIsRecording(true);
      message.info('开始语音输入，请说话...');
    }
  };

  // 处理文件上传
  const handleFileUpload = async (file: File) => {
    // 文件大小限制 (100MB)
    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      message.error(`文件过大，最大支持 ${maxSize / (1024 * 1024)} MB`);
      return false;
    }

    setIsUploading(true);
    
    try {
      // 在真实环境中，这里应该上传到服务器
      // 这里模拟上传过程
      await simulateFileUpload(file, (progress) => {
        setUploadProgress(progress);
      });

      const fileType = getFileTypeFromMime(file.type);
      const preview = fileType === 'image' ? URL.createObjectURL(file) : undefined;
      
      const newAttachment: Attachment = {
        id: generateId(),
        type: fileType,
        url: preview || '',
        name: file.name,
        size: file.size,
        mimeType: file.type,
        createdAt: Date.now(),
        preview
      };
      
      setAttachments([...attachments, newAttachment]);
      
      if (fileType === 'image') {
        message.success(`图片 ${file.name} 已添加`);
      } else {
        message.success(`文件 ${file.name} 已添加`);
      }

    } catch (error) {
      message.error('上传失败，请重试');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
    
    return false;
  };

  // 模拟文件上传
  const simulateFileUpload = (file: File, progressCallback: (progress: number) => void): Promise<void> => {
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        progressCallback(progress);
        
        if (progress >= 100) {
          clearInterval(interval);
          resolve();
        }
      }, 200);
    });
  };

  // 移除附件
  const handleRemoveAttachment = (id: string) => {
    setAttachments(attachments.filter(attachment => attachment.id !== id));
  };

  // 编辑图片
  const handleEditImage = (attachment: Attachment) => {
    setCurrentEditingImage(attachment);
    setShowImageEditor(true);
  };

  // 保存编辑后的图片
  const handleSaveEditedImage = (editedImageUrl: string) => {
    if (currentEditingImage) {
      setAttachments(attachments.map(attachment => 
        attachment.id === currentEditingImage.id 
          ? { ...attachment, url: editedImageUrl, preview: editedImageUrl } 
          : attachment
      ));
      setShowImageEditor(false);
      setCurrentEditingImage(null);
    }
  };

  // 发送消息
  const handleSend = () => {
    // 处理纯文本消息
    if (text.trim() && !attachments.length) {
      onSendMessage(text, 'text');
      setText('');
      return;
    }

    // 处理代码消息
    if (showCodeEditor && codeContent.trim()) {
      onSendMessage(codeContent, 'code');
      setShowCodeEditor(false);
      setCodeContent('');
      return;
    }

    // 处理附件
    if (attachments.length) {
      // 如果是单个图片且没有文本，直接发送图片消息
      if (attachments.length === 1 && attachments[0].type === 'image' && !text.trim()) {
        onSendMessage(attachments[0].url, 'image', attachments);
      } 
      // 如果有多个附件或附件+文本，作为复合消息发送
      else {
        const content = text.trim() ? text : '发送了附件';
        onSendMessage(content, 'text', attachments);
      }
      
      setText('');
      setAttachments([]);
      return;
    }

    // 防止发送空消息
    if (!text.trim()) {
      message.info('请输入消息内容');
    }
  };

  // 输入框自动增高
  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.resizableTextArea.textArea.style.height = 'auto';
      textAreaRef.current.resizableTextArea.textArea.style.height = 
        `${Math.min(textAreaRef.current.resizableTextArea.textArea.scrollHeight, 120)}px`;
    }
  }, [text]);

  // 处理按键事件
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Ctrl+Enter 或 Command+Enter 发送消息
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  // 打开代码编辑器
  const openCodeEditor = () => {
    setShowCodeEditor(true);
    setCodeContent('');
  };

  // 获取输入提示文本
  const getPlaceholderText = () => {
    switch (scenario) {
      case 'customer-service':
        return '请描述您的问题，可上传截图...';
      case 'dashboard':
        return '请输入数据查询或上传数据文件...';
      case 'doc-generation':
        return '请描述文档需求或上传模板...';
      case 'data-pipeline':
        return '请输入数据处理需求或上传数据源...';
      default:
        return '输入消息，Ctrl+Enter 发送...';
    }
  };

  // 选择代码语言
  const languageMenu = (
    <Menu 
      onClick={({ key }) => setCodeLanguage(key as string)}
      selectedKeys={[codeLanguage]}
    >
      <Menu.Item key="javascript">JavaScript</Menu.Item>
      <Menu.Item key="typescript">TypeScript</Menu.Item>
      <Menu.Item key="python">Python</Menu.Item>
      <Menu.Item key="java">Java</Menu.Item>
      <Menu.Item key="csharp">C#</Menu.Item>
      <Menu.Item key="sql">SQL</Menu.Item>
      <Menu.Item key="html">HTML</Menu.Item>
      <Menu.Item key="css">CSS</Menu.Item>
      <Menu.Item key="json">JSON</Menu.Item>
      <Menu.Item key="markdown">Markdown</Menu.Item>
    </Menu>
  );

  return (
    <div className="bg-white p-3 border-t border-gray-200">
      {/* 附件预览区 */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3 p-2 bg-gray-50 rounded">
          {attachments.map((attachment) => (
            <div 
              key={attachment.id}
              className="relative group w-20 h-20 bg-gray-100 rounded overflow-hidden flex items-center justify-center"
            >
              {attachment.type === 'image' ? (
                <img 
                  src={attachment.preview || attachment.url}
                  alt={attachment.name}
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <div className="text-xs text-center p-1">
                  <div className="text-2xl text-gray-500">📄</div>
                  <div className="truncate w-full">{attachment.name}</div>
                </div>
              )}
              
              <div className="absolute top-0 right-0 flex">
                {attachment.type === 'image' && (
                  <Button
                    type="text"
                    size="small"
                    icon={<EditOutlined />}
                    className="text-white bg-black bg-opacity-50 rounded-full p-1 m-1"
                    onClick={() => handleEditImage(attachment)}
                  />
                )}
                <Button
                  type="text"
                  size="small"
                  icon={<CloseCircleOutlined />}
                  className="text-white bg-black bg-opacity-50 rounded-full p-1 m-1"
                  onClick={() => handleRemoveAttachment(attachment.id)}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 上传进度 */}
      {isUploading && (
        <div className="mb-3">
          <Progress percent={uploadProgress} size="small" status="active" />
        </div>
      )}

      {/* 代码编辑器 */}
      {showCodeEditor && (
        <div className="mb-3 border rounded overflow-hidden">
          <div className="flex justify-between items-center bg-gray-100 p-2">
            <div className="flex items-center">
              <span className="mr-2">语言:</span>
              <Dropdown overlay={languageMenu} trigger={['click']}>
                <Button size="small">
                  {codeLanguage} <SettingOutlined />
                </Button>
              </Dropdown>
            </div>
            <Button 
              size="small" 
              type="text" 
              icon={<CloseCircleOutlined />}
              onClick={() => setShowCodeEditor(false)}
            />
          </div>
          <TextArea
            value={codeContent}
            onChange={(e) => setCodeContent(e.target.value)}
            placeholder="在此输入代码..."
            autoSize={{ minRows: 5, maxRows: 10 }}
            className="font-mono"
          />
        </div>
      )}

      {/* 文本输入区 */}
      <div className="flex items-end">
        <TextArea
          ref={textAreaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={getPlaceholderText()}
          autoSize={{ minRows: 1, maxRows: 5 }}
          onKeyDown={handleKeyDown}
          disabled={isUploading || showCodeEditor}
          className="flex-1 mr-2"
        />
        
        <div className="flex space-x-1">
          {/* 语音输入按钮 */}
          <Tooltip title={isRecording ? "停止录音" : "语音输入"}>
            <Button
              type={isRecording ? "primary" : "default"}
              icon={isRecording ? <LoadingOutlined /> : <AudioOutlined />}
              onClick={handleVoiceInput}
              disabled={!isSpeechRecognitionSupported || isUploading || showCodeEditor}
              danger={isRecording}
            />
          </Tooltip>
          
          {/* 图片上传按钮 */}
          <Tooltip title="上传图片">
            <Upload
              beforeUpload={handleFileUpload}
              showUploadList={false}
              accept="image/*"
              disabled={isUploading || showCodeEditor}
            >
              <Button 
                icon={<PictureOutlined />} 
                disabled={isUploading || showCodeEditor}
              />
            </Upload>
          </Tooltip>
          
          {/* 文件上传按钮 */}
          <Tooltip title="上传文件">
            <Upload
              beforeUpload={handleFileUpload}
              showUploadList={false}
              disabled={isUploading || showCodeEditor}
            >
              <Button 
                icon={<PaperClipOutlined />} 
                disabled={isUploading || showCodeEditor}
              />
            </Upload>
          </Tooltip>
          
          {/* 代码编辑器按钮 */}
          <Tooltip title="代码编辑器">
            <Button
              icon={<CodeOutlined />}
              onClick={openCodeEditor}
              disabled={isUploading || showCodeEditor}
            />
          </Tooltip>
          
          {/* 发送按钮 */}
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSend}
            disabled={isUploading}
          />
        </div>
      </div>

      {/* 辅助文本 */}
      <div className="mt-1 text-xs text-gray-400">
        {isRecording && (
          <div className="flex items-center text-red-500">
            <span className="mr-1">● 正在录音</span>
            <span>{transcript}</span>
          </div>
        )}
        {recordingError && <div className="text-red-500">{recordingError}</div>}
        {!isRecording && !recordingError && <span>按Ctrl+Enter发送消息</span>}
      </div>

      {/* 图片编辑器模态框 */}
      <Modal
        title="图片编辑"
        open={showImageEditor && currentEditingImage !== null}
        onCancel={() => setShowImageEditor(false)}
        footer={null}
        width={800}
      >
        {currentEditingImage && (
          <ImageEditor
            imageUrl={currentEditingImage.url}
            onSave={handleSaveEditedImage}
            onCancel={() => setShowImageEditor(false)}
          />
        )}
      </Modal>
    </div>
  );
}
