'use client';

import { useEffect, useRef } from 'react';
import ChartRenderer from './ChartRenderer';
import { Avatar, Spin, Typography, Card } from 'antd';
import { UserOutlined, RobotOutlined } from '@ant-design/icons';
import { ChatMessage, StructuredData, ContentType } from '../types';
import { formatTimestamp, detectCodeLanguage } from '../utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const { Text } = Typography;

interface MessageListProps {
  messages: ChatMessage[];
  onReplyTo?: (messageId: string) => void;
}


const ImageViewer = ({ src, attachments }: { src: string, attachments?: any[] }) => (
  <div className="image-viewer">
    <img src={src} alt="消息图片" style={{ maxWidth: '100%', borderRadius: '4px' }} />
  </div>
);

const FilePreview = ({ file }: { file: any }) => {
  // 根据文件类型获取图标和颜色
  const getFileIcon = (type: string, extension: string): { icon: string, color: string } => {
    const ext = extension.toLowerCase();

    // 图片文件
    if (type === 'image' || ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) {
      return { icon: '🖼️', color: 'text-blue-500' };
    }

    // 文档文件
    if (['pdf'].includes(ext)) {
      return { icon: '📄', color: 'text-red-500' };
    }
    if (['doc', 'docx'].includes(ext)) {
      return { icon: '📝', color: 'text-blue-700' };
    }
    if (['xls', 'xlsx', 'csv'].includes(ext)) {
      return { icon: '📊', color: 'text-green-600' };
    }
    if (['ppt', 'pptx'].includes(ext)) {
      return { icon: '📊', color: 'text-orange-500' };
    }

    // 音频文件
    if (type === 'audio' || ['mp3', 'wav', 'ogg', 'flac'].includes(ext)) {
      return { icon: '🎵', color: 'text-purple-500' };
    }

    // 视频文件
    if (type === 'video' || ['mp4', 'webm', 'avi', 'mov'].includes(ext)) {
      return { icon: '🎬', color: 'text-pink-500' };
    }

    // 压缩文件
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) {
      return { icon: '📦', color: 'text-yellow-600' };
    }

    // 代码文件
    if (['js', 'ts', 'jsx', 'tsx', 'py', 'java', 'c', 'cpp', 'cs', 'php', 'rb', 'go', 'html', 'css', 'json'].includes(ext)) {
      return { icon: '📜', color: 'text-gray-700' };
    }

    // 默认
    return { icon: '📄', color: 'text-gray-500' };
  };

  // 获取文件扩展名
  const getFileExtension = (filename: string): string => {
    return filename.split('.').pop() || '';
  };

  // 格式化文件大小
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
  };

  // 获取文件信息
  const extension = getFileExtension(file.name);
  const { icon, color } = getFileIcon(file.type, extension);
  const fileSize = formatFileSize(file.size);
  const isPreviewable = ['image', 'pdf', 'audio', 'video'].includes(file.type) ||
    ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'mp3', 'mp4'].includes(extension);

  // 格式化上传时间
  const uploadDate = file.createdAt ? new Date(file.createdAt).toLocaleDateString() : '';

  return (
    <div className="file-preview p-3 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
      <div className="flex items-center">
        {/* 文件图标 */}
        <div className={`text-2xl mr-3 ${color}`}>{icon}</div>

        {/* 文件信息 */}
        <div className="flex-1 min-w-0">
          <div className="font-medium text-gray-800 truncate" title={file.name}>
            {file.name}
          </div>
          <div className="text-xs text-gray-500 flex items-center mt-1">
            <span>{fileSize}</span>
            {uploadDate && (
              <>
                <span className="mx-1">•</span>
                <span>{uploadDate}</span>
              </>
            )}
            {file.mimeType && (
              <>
                <span className="mx-1">•</span>
                <span className="uppercase">{extension}</span>
              </>
            )}
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="ml-2 flex space-x-2">
          {isPreviewable && (
            <button
              className="p-1 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
              title="预览"
            >
              👁️
            </button>
          )}
          <button
            className="p-1 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded"
            title="下载"
          >
            ⬇️
          </button>
        </div>
      </div>

      {/* 预览缩略图（仅对图片显示） */}
      {file.type === 'image' && file.url && (
        <div className="mt-2 relative">
          <img
            src={file.url}
            alt={file.name}
            className="w-full h-24 object-cover rounded border border-gray-200"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-20 transition-opacity">
            <span className="text-white opacity-0 hover:opacity-100">查看大图</span>
          </div>
        </div>
      )}
    </div>
  );
};

const VoiceMessage = ({ src, duration }: { src: string, duration?: number }) => {
  const formattedDuration = duration ? `${Math.floor(duration / 60)}:${String(Math.round(duration % 60)).padStart(2, '0')}` : '0:00';

  return (
    <div className="voice-message p-2 rounded-lg bg-gray-50 border border-gray-200">
      <div className="flex items-center">
        <div className="text-lg text-blue-500 mr-2">🎤</div>
        <div className="flex-1">
          <div className="flex items-center">
            <audio
              controls
              src={src}
              className="w-full max-w-[200px]"
            >
              您的浏览器不支持音频播放
            </audio>
            <span className="ml-2 text-xs text-gray-500">{formattedDuration}</span>
          </div>

          {/* 音频波形图示意 - 实际应用中可以使用波形可视化组件 */}
          <div className="mt-1 flex items-center h-4 space-x-0.5">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="bg-blue-400 rounded-full w-1"
                style={{
                  height: `${Math.max(4, Math.min(16, Math.random() * 16))}px`,
                  opacity: i < 10 ? 1 : 0.5 // 前半部分已播放，后半部分未播放
                }}
              ></div>
            ))}
          </div>
        </div>

        {/* 转写文本按钮 */}
        <button
          className="ml-2 text-xs text-gray-600 hover:text-gray-800 p-1 hover:bg-gray-200 rounded"
          title="查看转写文本"
        >
          📝
        </button>
      </div>

      {/* 语音识别结果（可折叠） */}
      <div className="mt-2 text-xs text-gray-600 bg-white p-2 rounded border border-gray-200">
        <div className="flex items-center justify-between">
          <span className="font-medium">语音转写</span>
          <span className="text-xs text-blue-500">AI识别</span>
        </div>
        <p className="mt-1 text-gray-700">
          这是语音消息的自动转写内容示例。在实际应用中，这里会显示通过语音识别得到的文本内容。
        </p>
      </div>
    </div>
  );
};

const DataTable = ({ data, title, description }: { data: any, title: string, description?: string }) => {
  // 检查是否有数据
  if (!data || (!data.columns && !data.rows)) {
    return <div className="data-table-error">无效的表格数据</div>;
  }

  // 处理不同格式的数据
  let columns = data.columns || [];
  let rows = data.rows || [];

  // 如果数据是数组但没有明确的列定义，尝试从第一行数据生成列
  if (Array.isArray(rows) && rows.length > 0 && columns.length === 0) {
    if (typeof rows[0] === 'object') {
      columns = Object.keys(rows[0]).map(key => ({
        key,
        title: key.charAt(0).toUpperCase() + key.slice(1), // 首字母大写作为标题
        dataType: typeof rows[0][key]
      }));
    }
  }

  // 格式化单元格数据
  const formatCellData = (value: any, dataType?: string) => {
    if (value === null || value === undefined) return '-';

    if (dataType === 'date' || (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}/))) {
      return new Date(value).toLocaleDateString('zh-CN');
    } else if (dataType === 'number' || typeof value === 'number') {
      return value.toLocaleString('zh-CN');
    } else if (dataType === 'boolean' || typeof value === 'boolean') {
      return value ? '是' : '否';
    }
    return String(value);
  };

  return (
    <div className="data-table">
      <h4>{title}</h4>
      {description && <p className="text-gray-500 text-sm">{description}</p>}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col: any, i: number) => (
                <th key={i} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-200">
                  {col.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Array.isArray(rows) && rows.map((row: any, i: number) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                {columns.map((col: any, j: number) => (
                  <td key={j} className="px-4 py-2 text-sm text-gray-500 border border-gray-200">
                    {formatCellData(row[col.key], col.dataType)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          {/* 添加表格摘要行，显示统计信息 */}
          {data.summary && (
            <tfoot className="bg-gray-100">
              <tr>
                {columns.map((col: any, i: number) => (
                  <td key={i} className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200">
                    {data.summary[col.key] || '-'}
                  </td>
                ))}
              </tr>
            </tfoot>
          )}
        </table>
      </div>
      {/* 数据分析提示 */}
      {data.insights && (
        <div className="mt-2 p-2 bg-blue-50 text-blue-700 text-sm rounded">
          <strong>数据洞察:</strong> {data.insights}
        </div>
      )}
      {/* 分页控件 */}
      {data.pagination && (
        <div className="mt-2 flex justify-between items-center text-sm text-gray-500">
          <span>共 {data.pagination.total || rows.length} 条数据</span>
          <div className="flex space-x-2">
            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">第 {data.pagination.current || 1} 页</span>
            <span>共 {data.pagination.totalPages || 1} 页</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default function MessageList({ messages, onReplyTo }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 渲染消息内容
  const renderMessageContent = (message: ChatMessage) => {
    // 处理字符串类型的内容

    if (message.content) {
      // 检查是否为代码块
      if (message.contentType === 'md') {
        return (
          <div className="markdown-content prose prose-sm max-w-none dark:prose-invert">
            {typeof message.content === 'string' ? (
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  code: ({ node, inline, className, children, ...props }: any) => {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <div className="code-block-wrapper my-3">
                        <div className="code-header bg-gray-800 text-white px-4 py-1 text-sm font-mono rounded-t">
                          {match[1]}
                        </div>
                        <pre className="bg-gray-900 text-gray-100 p-4 rounded-b overflow-auto text-sm">
                          <code className={`${className} text-sm`} {...props}>
                            {children}
                          </code>
                        </pre>
                      </div>
                    ) : (
                      <code className={`${className} px-1 py-0.5 bg-gray-800 text-gray-100 rounded text-sm`} {...props}>
                        {children}
                      </code>
                    );
                  },
                  table: ({ node, children, ...props }: any) => (
                    <div className="overflow-x-auto my-3">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700" {...props}>
                        {children}
                      </table>
                    </div>
                  ),
                  thead: ({ node, children, ...props }: any) => (
                    <thead className="bg-gray-50 dark:bg-gray-800" {...props}>
                      {children}
                    </thead>
                  ),
                  tr: ({ node, children, ...props }: any) => (
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-900" {...props}>
                      {children}
                    </tr>
                  ),
                  th: ({ node, children, ...props }: any) => (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider" {...props}>
                      {children}
                    </th>
                  ),
                  td: ({ node, children, ...props }: any) => (
                    <td className="px-6 py-4 whitespace-normal text-sm" {...props}>
                      {children}
                    </td>
                  )
                }}
              >
                {message.content}
              </ReactMarkdown>
            ) : (
              <div>无法渲染非字符串内容</div>
            )}
          </div>
        );
      }
      console.log('消息对象:', JSON.stringify(message, null, 2));

      // 检查是否为图表数据
      if (message.contentType === 'chart') {
        // 直接传递给ChartRenderer，它会自己处理JSON解析
        return <ChartRenderer chartData={message.content} />;
      }

      // 检查是否为表格数据
      if (message.contentType === 'table' && message.structuredData) {
        const structData = message.structuredData as StructuredData;
        return (
          <DataTable
            data={structData.data}
            title={structData.title || "数据表格"}
            description={structData.description}
          />
        );
      }

      // 默认文本渲染，处理换行
      const textLines = message.content.split('\n');
      return (
        <div className="whitespace-pre-wrap break-words">
          {textLines.map((line: string, i: number) => (
            <div key={i}>{line || <br />}</div>
          ))}
        </div>
      );
    }

    // 处理对象类型的内容
    if (message.content && typeof message.content === 'object') {
      // 处理不同类型的消息内容
      switch (message.contentType) {
        case 'image':
          const imgSrc = message.content.url || '';
          return (
            <ImageViewer
              src={imgSrc}
              attachments={message.attachments || []}
            />
          );

        case 'voice':
        case 'audio':
          const audioSrc = message.content.url || '';
          const duration = message.content.duration;
          return (
            <VoiceMessage
              src={audioSrc}
              duration={duration}
            />
          );

        case 'table':
          // 处理结构化数据表格
          if (message.structuredData) {
            const structData = message.structuredData as StructuredData;
            return (
              <DataTable
                data={structData.data}
                title={structData.title || "数据表格"}
                description={structData.description}
              />
            );
          }
          return <div>无法显示表格数据</div>;

        case 'text':
          // 处理文本内容
          if (message.content.text) {
            // 检查文本内容是否包含图表数据
            if (message.content.text.includes('"type":')) {
              // 直接传递给ChartRenderer，它会处理代码块提取和JSON解析
              return <ChartRenderer chartData={message.content.text} />;
            }

            // 如果不是图表或解析失败，显示普通文本
            const textLines = message.content.text.split('\n');
            return (
              <div className="whitespace-pre-wrap break-words">
                {textLines.map((line: string, i: number) => (
                  <div key={i}>{line || <br />}</div>
                ))}
              </div>
            );
          }
          break;
        default:
          // 未知对象类型，显示JSON字符串
          return (
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(message.content, null, 2)}
            </pre>
          );
      }
    }

    // 如果content既不是字符串也不是对象，或者是对象但没有匹配的处理方式，显示默认消息
    return <div>无效的消息内容</div>;
  };

  // 渲染附件
  const renderAttachments = (message: ChatMessage) => {
    if (!message.attachments || message.attachments.length === 0) return null;

    return (
      <div className="mt-3 space-y-2">
        {message.attachments.map((attachment) => (
          <FilePreview
            key={attachment.id}
            file={attachment}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`
              max-w-[95%] md:max-w-[85%] lg:max-w-[75%] 
              rounded-lg 
              ${message.sender === 'user'
                ? 'bg-blue-100 rounded-tr-none'
                : 'bg-white rounded-tl-none shadow-sm border border-gray-100'}
            `}
          >
            <div className="flex items-center p-3 pb-2 border-b border-gray-100">
              <Avatar
                size="small"
                icon={message.sender === 'user' ? <UserOutlined /> : <RobotOutlined />}
                className={message.sender === 'user' ? 'bg-blue-500' : 'bg-green-500'}
              />
              <Text className="ml-2 text-xs text-gray-500">
                {formatTimestamp(message.timestamp)}
              </Text>

              {/* 引用和回复 */}
              {message.replyTo && (
                <Text className="ml-auto text-xs text-blue-500">
                  回复了一条消息
                </Text>
              )}
            </div>

            {/* 引用的消息 */}
            {message.replyTo && message.replyToContent && (
              <div className="mx-3 mt-2 p-2 bg-gray-50 rounded border-l-2 border-gray-300 text-xs text-gray-500">
                <div className="truncate">{message.replyToContent}</div>
              </div>
            )}

            <div className="p-3">
              {message.status === 'sending' ? (
                <div className="flex items-center">
                  <Spin size="small" className="mr-2" />
                  <span className="text-gray-400">发送中...</span>
                </div>
              ) : (
                <>
                  {renderMessageContent(message)}
                  {renderAttachments(message)}
                </>
              )}
            </div>

            {/* 交互按钮 */}
            {onReplyTo && message.status !== 'sending' && (
              <div className="flex justify-end px-3 py-1 border-t border-gray-100 bg-gray-50 rounded-b-lg">
                <Text
                  className="text-xs text-blue-500 cursor-pointer hover:text-blue-700"
                  onClick={() => onReplyTo(message.id)}
                >
                  回复
                </Text>
              </div>
            )}
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
