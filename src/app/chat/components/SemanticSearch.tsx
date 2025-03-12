'use client';

import { useState, useEffect, useRef } from 'react';
import { Input, List, Tag, Button, Empty, Spin, Tooltip, Modal } from 'antd';
import { SearchOutlined, CloseOutlined, HistoryOutlined, FileSearchOutlined, FileOutlined } from '@ant-design/icons';
import { ChatMessage, ChatSession, Attachment, FileType } from '../types';

const { Search } = Input;

interface SemanticSearchProps {
  sessions: ChatSession[];
  messages: ChatMessage[];
  onMessageSelect: (sessionId: string, messageId: string) => void;
}

export default function SemanticSearch({
  sessions,
  messages,
  onMessageSelect
}: SemanticSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchBox, setShowSearchBox] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [selectedMessageDetails, setSelectedMessageDetails] = useState<ChatMessage | null>(null);
  const [showMessageDetails, setShowMessageDetails] = useState(false);

  // 初始化从本地存储加载搜索历史
  useEffect(() => {
    const history = localStorage.getItem('chatSearchHistory');
    if (history) {
      setSearchHistory(JSON.parse(history));
    }
  }, []);

  // 保存搜索历史到本地存储
  const saveSearchHistory = (query: string) => {
    if (!query.trim()) return;
    
    const updatedHistory = [
      query,
      ...searchHistory.filter(item => item !== query)
    ].slice(0, 10); // 只保留最近10条
    
    setSearchHistory(updatedHistory);
    localStorage.setItem('chatSearchHistory', JSON.stringify(updatedHistory));
  };

  // 清除搜索历史
  const clearSearchHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('chatSearchHistory');
  };

  // 从搜索历史中选择
  const selectFromHistory = (query: string) => {
    setSearchQuery(query);
    handleSearch(query);
  };

  // 处理搜索
  const handleSearch = (value: string) => {
    if (!value.trim()) {
      setSearchResults([]);
      return;
    }
    
    setLoading(true);
    
    // 模拟语义搜索延迟
    setTimeout(() => {
      // 这里是简化的基于关键词的搜索，实际应用中应使用语义搜索API
      const results = messages.filter(message => {
        const content = typeof message.content === 'string' 
          ? message.content 
          : JSON.stringify(message.content);
        
        return content.toLowerCase().includes(value.toLowerCase());
      }).map(message => {
        // 找到对应的会话
        const session = sessions.find(s => s.id === message.sessionId);
        
        return {
          message,
          session,
          score: 0.5 + Math.random() * 0.5 // 模拟相关性分数
        };
      });
      
      // 按相关性分数排序
      results.sort((a, b) => b.score - a.score);
      
      setSearchResults(results);
      setLoading(false);
      
      // 添加到搜索历史
      saveSearchHistory(value);
    }, 500);
  };

  // 查看消息详情
  const viewMessageDetails = (message: ChatMessage) => {
    setSelectedMessageDetails(message);
    setShowMessageDetails(true);
  };

  // 高亮搜索结果中的关键词
  const highlightText = (text: string, keyword: string) => {
    if (!keyword.trim()) return text;
    
    const parts = text.split(new RegExp(`(${keyword})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === keyword.toLowerCase() 
        ? <span key={index} className="bg-yellow-200">{part}</span> 
        : part
    );
  };

  // 获取消息预览文本
  const getMessagePreview = (message: ChatMessage): string => {
    if (typeof message.content === 'string') {
      // 移除markdown和HTML标记以纯文本显示
      return message.content
        .replace(/```[\s\S]*?```/g, '[代码块]')
        .replace(/<[^>]*>/g, '')
        .substring(0, 100);
    }
    
    if (message.attachments && message.attachments.length > 0) {
      return `[附件] ${message.attachments.map(a => a.name).join(', ')}`;
    }
    
    return '[复杂内容]';
  };

  // 获取文件图标
  const getFileIcon = (attachment: Attachment) => {
    switch (attachment.type) {
      case 'image':
        return <span className="anticon">
          <svg viewBox="64 64 896 896" focusable="false" data-icon="file-image" width="1em" height="1em" fill="currentColor" aria-hidden="true">
            <path d="M553.1 509.1l-77.8 99.2-41.1-52.4a8 8 0 00-12.6 0l-99.8 127.2a7.98 7.98 0 006.3 12.9H696c6.7 0 10.4-7.7 6.3-12.9l-136.5-174a8.1 8.1 0 00-12.7 0zM360 442a40 40 0 1080 0 40 40 0 10-80 0zm494.6-153.4L639.4 73.4c-6-6-14.1-9.4-22.6-9.4H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V311.3c0-8.5-3.4-16.7-9.4-22.7zM790.2 326H602V137.8L790.2 326zm1.8 562H232V136h302v216a42 42 0 0042 42h216v494z"></path>
          </svg>
        </span>;
      case 'text':
      case 'code':
        return <span className="anticon">
          <svg viewBox="64 64 896 896" focusable="false" data-icon="file-text" width="1em" height="1em" fill="currentColor" aria-hidden="true">
            <path d="M854.6 288.6L639.4 73.4c-6-6-14.1-9.4-22.6-9.4H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V311.3c0-8.5-3.4-16.7-9.4-22.7zM790.2 326H602V137.8L790.2 326zm1.8 562H232V136h302v216a42 42 0 0042 42h216v494zM504 618H320c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h184c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8zM312 490v48c0 4.4 3.6 8 8 8h384c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8H320c-4.4 0-8 3.6-8 8z"></path>
          </svg>
        </span>;
      case 'pdf':
        return <span className="anticon">
          <svg viewBox="64 64 896 896" focusable="false" data-icon="file-pdf" width="1em" height="1em" fill="currentColor" aria-hidden="true">
            <path d="M531.3 574.4l.3-1.4c5.8-23.9 13.1-53.7 7.4-80.7-3.8-21.3-19.5-29.6-32.9-30.2-15.8-.7-29.9 8.3-33.4 21.4-6.6 24-.7 56.8 10.1 98.6-13.6 32.4-35.3 79.5-51.2 107.5-29.6 15.3-69.3 38.9-75.2 68.7-1.2 5.5.2 12.5 3.5 18.8 3.7 7 9.6 12.4 16.5 15 3 1.1 6.6 2 10.8 2 17.6 0 46.1-14.2 84.1-79.4 5.8-1.9 11.8-3.9 17.6-5.9 27.2-9.2 55.4-18.8 80.9-23.1 28.2 15.1 60.3 24.8 82.1 24.8 21.8 0 35.3-9.3 41.5-28.2 6.1-18.5 1-34.4-12.4-39-12.9-4.4-30.7-2.2-44.7 5.5-12.6 6.9-22.6 18.7-29.4 34.2-16.4-.4-35.4-5.1-59.7-13.3 13.2-24.2 26.5-58.5 21.1-90.3-2.9-17.9-15.4-30.1-32.9-32.2-15.8-1.9-29.2 4.9-36.9 18.7-12.1 21.6-7.8 59.5 6 90.7-5.3 11.2-14.5 31.5-18.2 39.6-6.8 14.9-13.1 28.9-18.6 41-21.2 47.4-42.6 95.7-38.5 133.5 1.3 11.8 5.7 21.7 13 29.2 7.7 8 17.7 12 29.8 12 5.1 0 10.3-.6 15.3-1.8 28.6-7 56.2-32.5 82.6-75.8 18.6-30.5 37.3-66.1 52.6-96.5 22.7-8.6 42.1-19.5 57.1-32.2 14.4-12.2 36.1-35.7 28.8-65.6-5.8-24.2-34.6-42.6-57.2-42.6-10.6 0-19.9 3.4-27.4 10-9 8-12.7 18.8-10.9 31.7zm-143.9 79.8c-3.5 6.1-7.3 12-12.3 19.6-.9 1.4-1.8 2.9-2.8 4.4-27.9 42.6-47.4 62.1-64.8 66.6-2.5.6-4.4.9-5.9.9-1.8 0-3.6 0-6.2-5-1.2-2.5-3.1-6.8-2.2-10.6 3.5-15.7 19.9-45.7 51.6-67.3 7.9-5.4 16.1-10.2 24.7-15.2 4.5-2.7 9.1-5.3 13.5-8 2.6 4.8 4.8 9.8 4.4 14.6zm40.2-169.4c.8-1.4 2.9-4.6 6.9-4.6.7 0 1.4.1 2.2.4 5.6 1.8 6.8 11.5 7.1 13.6 1.8 12.7-1.1 28.2-8.6 46.2-4.1-16.4-6.8-32.3-6.8-43.6-.1-4.2.2-8.5.3-12h-1.1zm75.5 137.9c-19.9 3.5-42.3 11.7-64.9 19.8 5.8-12.2 11.9-25.2 18-38.9 6.9-15.2 13.9-30.4 20.4-44.7 13.3 18.8 24.5 44.6 27.9 59.2-1 1.5-1.3 3-1.4 4.6zm28.9-71.9c2.3-9.7 11.6-20.6 17.1-20.6 2.6 0 3.5.8 3.6.9 2.2 1.6 3.4 9.6 1.3 15.5-6.7 19.9-46.4 37.3-53.5 38.3 5.5-12.2 28.1-25.1 31.5-34.1zm145.2 69.9c-5.4 16.3-15.5 18.5-24.3 18.5-8.8 0-17.3-2.2-25.6-5 5.7-14.7 17.1-27.6 28.4-33.7 4.7-2.5 9.5-3.7 13.6-3.7 2.5 0 4.8.5 6.6 1.4 10.5 5.2 6 12.6 1.3 22.5zM392.5 618.7c-27.3 33.8-43.9 44.9-45.7 45.7-11-7.4-4.2-21.2-1.4-29.9 5.6-16.7 26.2-31.7 50.9-45.9-1.4 10.9-2.7 21.1-3.8 30.1zm381.7-288l-1.3-2.8-137.9-297.5c-5.5-11.8-17.3-19.4-30.5-19.4H236.2c-18.4 0-33.3 14.8-33.3 33.1v71.8H190V59.9C190 26.8 216.9 0 250.1 0h507.7c7.5 0 14.2 2.8 19.2 8.4l180.3 217.5c3.6 4.4 5.6 9.8 5.6 15.5v572.5c0 33.1-26.9 59.9-60.1 59.9H250.1c-33.2 0-60.1-26.9-60.1-59.9V649h12.9v149.4c0 25.9 21.2 47.1 47.2 47.1h627.9c26 0 47.2-21.2 47.2-47.1V247.4c0-6.2-2.6-12.3-7-16.7zM681.7 76.9l142.5 246.7h-142c-.3.2-.6.2-.9.2-.2 0-.5 0-.8-.2h-4.5V76.9h5.7z"></path>
          </svg>
        </span>;
      case 'archive':
        return <span className="anticon">
          <svg viewBox="64 64 896 896" focusable="false" data-icon="file-zip" width="1em" height="1em" fill="currentColor" aria-hidden="true">
            <path d="M296 392h64v64h-64zm0 190v160h128V582h-64v-62h-64v62zm80 48v64h-32v-64h32zm-16-302h64v64h-64zm-64-64h64v64h-64zm64 192h64v64h-64zm0-256h64v64h-64zm494.6 88.6L639.4 73.4c-6-6-14.1-9.4-22.6-9.4H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V311.3c0-8.5-3.4-16.7-9.4-22.7zM790.2 326H602V137.8L790.2 326zm1.8 562H232V136h64v64h64v-64h174v216a42 42 0 0042 42h216v494z"></path>
          </svg>
        </span>;
      default:
        return <FileOutlined />;
    }
  };

  return (
    <>
      {!showSearchBox ? (
        <Tooltip title="搜索聊天记录">
          <Button 
            type="text" 
            icon={<SearchOutlined />} 
            onClick={() => {
              setShowSearchBox(true);
              // 延迟聚焦，确保组件已渲染
              setTimeout(() => {
                const inputElement = document.querySelector('.search-container input') as HTMLInputElement;
                if (inputElement) {
                  inputElement.focus();
                }
              }, 100);
            }}
          />
        </Tooltip>
      ) : (
        <div className="search-container relative">
          <div className="search-box flex items-center bg-white dark:bg-gray-800 rounded-lg shadow-md p-2 mb-2">
            <Search
              placeholder="搜索聊天记录..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onSearch={handleSearch}
              enterButton
              loading={loading}
              className="flex-grow"
              allowClear
            />
            <Button 
              type="text" 
              icon={<CloseOutlined />} 
              onClick={() => {
                setShowSearchBox(false);
                setSearchQuery('');
                setSearchResults([]);
              }}
              className="ml-2"
            />
          </div>
          
          {/* 搜索历史 */}
          {searchHistory.length > 0 && !searchQuery && (
            <div className="search-history bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 mb-2">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <HistoryOutlined className="mr-2" />
                  <span className="font-medium">搜索历史</span>
                </div>
                <Button type="text" size="small" onClick={clearSearchHistory}>
                  清除
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {searchHistory.map((query, index) => (
                  <Tag 
                    key={index}
                    className="cursor-pointer"
                    onClick={() => selectFromHistory(query)}
                  >
                    {query}
                  </Tag>
                ))}
              </div>
            </div>
          )}
          
          {/* 搜索结果 */}
          {searchQuery && (
            <div className="search-results bg-white dark:bg-gray-800 rounded-lg shadow-md p-0 max-h-80 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center">
                  <Spin tip="搜索中..." />
                </div>
              ) : searchResults.length === 0 ? (
                <Empty 
                  description="没有找到相关结果" 
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  className="py-6" 
                />
              ) : (
                <List
                  itemLayout="vertical"
                  dataSource={searchResults}
                  renderItem={item => (
                    <List.Item
                      key={item.message.id}
                      onClick={() => onMessageSelect(item.message.sessionId, item.message.id)}
                      className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors p-3"
                      extra={
                        <Tooltip title="查看详情">
                          <Button 
                            type="text" 
                            size="small"
                            icon={<FileSearchOutlined />} 
                            onClick={(e) => {
                              e.stopPropagation();
                              viewMessageDetails(item.message);
                            }}
                          />
                        </Tooltip>
                      }
                    >
                      <List.Item.Meta
                        title={
                          <div className="flex justify-between items-center">
                            <span>
                              {item.session?.title || '未命名会话'}
                            </span>
                            <Tag color="blue">{Math.round(item.score * 100)}% 匹配</Tag>
                          </div>
                        }
                        description={
                          <div className="text-xs text-gray-500">
                            {new Date(item.message.timestamp).toLocaleString()}
                            {' - '}
                            {item.message.sender === 'user' ? '我' : 'AI'}
                          </div>
                        }
                      />
                      <div className="mt-1 text-sm">
                        {highlightText(getMessagePreview(item.message), searchQuery)}
                        {getMessagePreview(item.message).length > 100 && '...'}
                      </div>
                    </List.Item>
                  )}
                />
              )}
            </div>
          )}
        </div>
      )}
      
      {/* 消息详情模态框 */}
      <Modal
        title="消息详情"
        open={showMessageDetails}
        onCancel={() => setShowMessageDetails(false)}
        footer={[
          <Button 
            key="jumpTo" 
            type="primary"
            onClick={() => {
              if (selectedMessageDetails) {
                onMessageSelect(selectedMessageDetails.sessionId, selectedMessageDetails.id);
                setShowMessageDetails(false);
              }
            }}
          >
            跳转到此消息
          </Button>,
          <Button key="close" onClick={() => setShowMessageDetails(false)}>
            关闭
          </Button>
        ]}
        width={700}
      >
        {selectedMessageDetails && (
          <div>
            <div className="mb-4">
              <div className="text-gray-500 mb-1">
                发送者: {selectedMessageDetails.sender === 'user' ? '我' : 'AI'}
              </div>
              <div className="text-gray-500 mb-3">
                时间: {new Date(selectedMessageDetails.timestamp).toLocaleString()}
              </div>
              <div className="border p-4 rounded bg-gray-50 whitespace-pre-wrap">
                {typeof selectedMessageDetails.content === 'string' 
                  ? selectedMessageDetails.content 
                  : JSON.stringify(selectedMessageDetails.content, null, 2)
                }
              </div>
            </div>
            
            {selectedMessageDetails.attachments && selectedMessageDetails.attachments.length > 0 && (
              <div>
                <div className="font-medium mb-2">附件 ({selectedMessageDetails.attachments.length})</div>
                <List
                  size="small"
                  bordered
                  dataSource={selectedMessageDetails.attachments}
                  renderItem={attachment => (
                    <List.Item>
                      <div className="flex items-center">
                        <div className="mr-2">
                          {getFileIcon(attachment)}
                        </div>
                        <div>{attachment.name}</div>
                      </div>
                    </List.Item>
                  )}
                />
              </div>
            )}
          </div>
        )}
      </Modal>
    </>
  );
}
