'use client';

import { useState, useEffect } from 'react';
import { Layout, Tabs } from 'antd';
import ChatInterface from './components/ChatInterface';
import ChatSidebar from './components/ChatSidebar';
import { ChatMessage, ChatSession, ContentType } from './types';
import { mockSessions, mockMessages } from './mockData';

const { Content, Sider } = Layout;    
const { TabPane } = Tabs;

export default function ChatPage() {
  const [sessions, setSessions] = useState<ChatSession[]>(mockSessions);
  const [currentSessionId, setCurrentSessionId] = useState<string>(mockSessions[0]?.id || '');
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // 响应式设计
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 发送消息处理
  const handleSendMessage = (newMessage: ChatMessage) => {
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    
    // 模拟AI响应
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: `msg-${Date.now()}`,
        sessionId: currentSessionId,
        sender: 'assistant',
        content: getAIResponse(newMessage.content, newMessage.contentType),
        contentType: getResponseType(newMessage.contentType),
        timestamp: Date.now(),
        status: 'sent',
        attachments: []
      };
      setMessages((prevMessages) => [...prevMessages, aiResponse]);
    }, 1000);
  };

  // 根据不同场景和内容类型获取AI响应
  const getAIResponse = (content: string | { text?: string; url?: string; duration?: number; [key: string]: any; }, contentType: string): string => {
    // 处理不同类型的content
    const textContent = typeof content === 'string' 
      ? content 
      : content.text || JSON.stringify(content);
    
    // 针对不同应用场景的响应逻辑
    const currentSession = sessions.find(s => s.id === currentSessionId);
    const scenario = currentSession?.scenario || 'general';

    switch (scenario) {
      case 'customer-service':
        return `这是智能客服系统的回复：我们已经收到您的${contentType === 'image' ? '图片' : '消息'}，客服正在处理中。您可以查看常见问题解答，或者继续描述您的问题。`;
      
      case 'dashboard':
        return `这是数据仪表板的回复：根据您提供的${contentType === 'image' ? '图表' : '数据'}，我们生成了分析结果。您可以在右侧查看可视化图表。`;
      
      case 'doc-generation':
        return `这是文档生成系统的回复：根据您的${contentType === 'image' ? '模板图片' : '要求'}，我们已经开始生成文档。您可以指定更多的格式和内容要求。`;
      
      case 'data-pipeline':
        return `这是数据分析管道的回复：您的${contentType === 'image' ? '数据图表' : '分析请求'}已加入处理队列。处理完成后会通知您，您可以指定数据处理的具体参数。`;
      
      default:
        return `我已收到您的${contentType === 'image' ? '图片' : '消息'}，请问还有什么我可以帮助您的？`;
    }
  };

  // 根据输入类型确定响应类型
  const getResponseType = (inputType: string): ContentType => {
    switch (inputType) {
      case 'image':
        return 'text';
      case 'audio':
        return 'text';
      case 'file':
        return 'text';
      case 'code':
        return 'code';
      case 'voice':
        return 'text';
      case 'chart':
        return 'chart';
      case 'table':
        return 'table';
      case 'video':
        return 'text';
      default:
        return 'text';
    }
  };

  // 创建新会话
  const handleNewSession = (sessionName: string, scenario: 'general' | 'customer-service' | 'dashboard' | 'doc-generation' | 'data-pipeline') => {
    const newSession: ChatSession = {
      id: `session-${Date.now()}`,
      title: sessionName,
      name: sessionName,
      scenario: scenario,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [],
      lastMessage: '新建会话',
      unreadCount: 0
    };
    
    setSessions([newSession, ...sessions]);
    setCurrentSessionId(newSession.id);
    setMessages([]);
  };

  // 切换会话
  const handleSessionChange = (sessionId: string) => {
    setCurrentSessionId(sessionId);
    
    // 在实际应用中，这里应该从API获取会话消息
    // 这里使用模拟数据
    setMessages(mockMessages.filter(msg => msg.sessionId === sessionId));
    
    // 如果是移动设备，切换会话后自动关闭侧边栏
    if (isMobile) {
      setCollapsed(true);
    }
  };

  return (
    <Layout className="h-screen">
      <Sider
        width={300}
        collapsible
        collapsed={collapsed}
        collapsedWidth={isMobile ? 0 : 80}
        onCollapse={setCollapsed}
        className="bg-white border-r border-gray-200 overflow-y-auto"
        theme="light"
      >
        <ChatSidebar
          sessions={sessions}
          currentSessionId={currentSessionId}
          onSessionChange={handleSessionChange}
          onNewSession={handleNewSession}
          collapsed={collapsed}
        />
      </Sider>
      <Content>
        <ChatInterface
          messages={messages}
          onSendMessage={handleSendMessage}
          session={sessions.find(s => s.id === currentSessionId)}
          onToggleSidebar={() => setCollapsed(!collapsed)}
          isMobile={isMobile}
        />
      </Content>
    </Layout>
  );
}
