'use client';

import { useState, useRef, useEffect } from 'react';
import { Layout, Button, Tooltip } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import MessageList from './MessageList';
import MultiModalInput from './MultiModalInput';
import { ChatMessage, ChatSession } from '../types';

const { Header, Content, Footer } = Layout;

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (message: ChatMessage) => void;
  session?: ChatSession;
  onToggleSidebar: () => void;
  isMobile: boolean;
}

export default function ChatInterface({
  messages,
  onSendMessage,
  session,
  onToggleSidebar,
  isMobile
}: ChatInterfaceProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  // 自动滚动到底部
  useEffect(() => {
    if (isAtBottom && contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [messages, isAtBottom]);

  // 监听滚动事件
  const handleScroll = () => {
    if (contentRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
      const isBottom = scrollHeight - scrollTop - clientHeight < 50;
      setIsAtBottom(isBottom);
    }
  };

  // 发送消息
  const handleSendMessage = (content: string, contentType: 'text' | 'image' | 'audio' | 'video' | 'file' | 'code' | 'chart', attachments: any[] = []) => {
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sessionId: session?.id || '',
      sender: 'user',
      content,
      contentType,
      timestamp: Date.now(),
      status: 'sending',
      attachments
    };
    
    onSendMessage(newMessage);
  };

  // 获取会话标题
  const getScenarioTitle = (scenario?: string) => {
    switch (scenario) {
      case 'customer-service':
        return '智能客服系统';
      case 'dashboard':
        return '动态数据仪表板';
      case 'doc-generation':
        return '自动化文档生成';
      case 'data-pipeline':
        return '实时数据分析管道';
      default:
        return '聊天';
    }
  };

  return (
    <Layout className="h-screen flex flex-col">
      <Header className="flex justify-between items-center bg-white border-b border-gray-200 px-4 py-0 h-16">
        <div className="flex items-center">
          <Button
            type="text"
            icon={isMobile ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={onToggleSidebar}
            className="mr-3"
          />
          <div>
            <h2 className="text-lg font-medium m-0">{session?.name || '新对话'}</h2>
            <div className="text-xs text-gray-500">{getScenarioTitle(session?.scenario)}</div>
          </div>
        </div>
        <div className="flex space-x-2">
          {/* 这里可以添加更多操作按钮 */}
        </div>
      </Header>
      
      <Content 
        ref={contentRef}
        className="flex-1 overflow-y-auto p-4 bg-gray-50"
        onScroll={handleScroll}
      >
        <MessageList messages={messages} />
        
        {!isAtBottom && (
          <Tooltip title="滚动到最新消息">
            <Button
              type="primary"
              shape="circle"
              className="fixed right-8 bottom-24 z-10 shadow-md"
              onClick={() => {
                setIsAtBottom(true);
              }}
            >
              ↓
            </Button>
          </Tooltip>
        )}
      </Content>
      
      <Footer className="p-0 bg-white border-t border-gray-200">
        <MultiModalInput 
          onSendMessage={handleSendMessage}
          scenario={session?.scenario}
        />
      </Footer>
    </Layout>
  );
}
