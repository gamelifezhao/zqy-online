'use client';

import { useState } from 'react';
import { Button, Input, Menu, Badge, Modal, Radio, Divider, Typography } from 'antd';
import {
  PlusOutlined,
  MessageOutlined,
  CustomerServiceOutlined,
  DashboardOutlined,
  FileTextOutlined,
  ApiOutlined,
  SearchOutlined,
  DeleteOutlined,
  EditOutlined
} from '@ant-design/icons';
import { ChatSession } from '../types';
import { formatTimestamp, truncateText } from '../utils';

const { Title, Text } = Typography;

interface ChatSidebarProps {
  sessions: ChatSession[];
  currentSessionId: string;
  onSessionChange: (sessionId: string) => void;
  onNewSession: (sessionName: string, scenario: 'general' | 'customer-service' | 'dashboard' | 'doc-generation' | 'data-pipeline') => void;
  collapsed: boolean;
}

export default function ChatSidebar({
  sessions,
  currentSessionId,
  onSessionChange,
  onNewSession,
  collapsed
}: ChatSidebarProps) {
  const [searchText, setSearchText] = useState('');
  const [showNewSessionModal, setShowNewSessionModal] = useState(false);
  const [newSessionName, setNewSessionName] = useState('');
  const [newSessionScenario, setNewSessionScenario] = useState<'general' | 'customer-service' | 'dashboard' | 'doc-generation' | 'data-pipeline'>('general');

  // 创建新会话
  const handleCreateNewSession = () => {
    if (!newSessionName.trim()) {
      return;
    }
    onNewSession(newSessionName, newSessionScenario);
    setShowNewSessionModal(false);
    setNewSessionName('');
    setNewSessionScenario('general');
  };

  // 获取场景图标
  const getScenarioIcon = (scenario?: string) => {
    switch (scenario) {
      case 'customer-service':
        return <CustomerServiceOutlined />;
      case 'dashboard':
        return <DashboardOutlined />;
      case 'doc-generation':
        return <FileTextOutlined />;
      case 'data-pipeline':
        return <ApiOutlined />;
      default:
        return <MessageOutlined />;
    }
  };

  // 过滤会话列表
  const filteredSessions = searchText
    ? sessions.filter(session =>
      (session.name || session.title).toLowerCase().includes(searchText.toLowerCase())
    )
    : sessions;

  return (
    <div className="flex flex-col h-full">
      {/* 标题和新建会话按钮 */}
      {!collapsed && (
        <div className="flex justify-between items-center p-4">
          <Title level={4} className="m-0">对话</Title>
          <Button
            type="primary"
            shape="circle"
            icon={<PlusOutlined />}
            onClick={() => setShowNewSessionModal(true)}
          />
        </div>
      )}

      {/* 折叠状态下只显示新建按钮 */}
      {collapsed && (
        <div className="flex justify-center py-4">
          <Button
            type="primary"
            shape="circle"
            icon={<PlusOutlined />}
            onClick={() => setShowNewSessionModal(true)}
          />
        </div>
      )}

      {/* 搜索框 */}
      {!collapsed && (
        <div className="px-4 pb-2">
          <Input
            placeholder="搜索对话"
            prefix={<SearchOutlined className="text-gray-400" />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
      )}

      {/* 会话列表 */}
      <div className="flex-1 overflow-y-auto">
        <Menu
          mode="inline"
          selectedKeys={[currentSessionId]}
          className="border-r-0"
        >
          {filteredSessions.map(session => (
            <Menu.Item
              key={session.id}
              style={{ height: '70px' }}
              icon={getScenarioIcon(session.scenario)}
              onClick={() => onSessionChange(session.id as string)}
              className="flex items-center"
            >
              {!collapsed && (
                <div className="flex justify-between items-center w-full">
                  <div className="overflow-hidden">
                    <div className="font-medium truncate">{session.name || session.title}</div>
                    <div className="text-xs text-gray-500 truncate">
                      {session.lastMessage && truncateText(session.lastMessage, 20)}
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <Text className="text-xs text-gray-400">
                      {formatTimestamp(session.createdAt)}
                    </Text>
                    {(session.unreadCount ?? 0) > 0 && (
                      <Badge count={session.unreadCount ?? 0} size="small" />
                    )}
                  </div>
                </div>
              )}
            </Menu.Item>
          ))}
        </Menu>
      </div>

      {/* 新建会话模态框 */}
      <Modal
        title="新建对话"
        open={showNewSessionModal}
        onOk={handleCreateNewSession}
        onCancel={() => setShowNewSessionModal(false)}
        okText="创建"
        cancelText="取消"
      >
        <div className="mb-4">
          <Text strong>对话名称</Text>
          <Input
            placeholder="输入对话名称"
            value={newSessionName}
            onChange={(e) => setNewSessionName(e.target.value)}
            className="mt-1"
            autoFocus
          />
        </div>

        <div>
          <Text strong>应用场景</Text>
          <Radio.Group
            className="mt-2 w-full"
            value={newSessionScenario}
            onChange={(e) => setNewSessionScenario(e.target.value as 'general' | 'customer-service' | 'dashboard' | 'doc-generation' | 'data-pipeline')}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <Radio.Button value="general" className="h-auto text-left p-2">
                <div className="flex items-start">
                  <MessageOutlined className="mt-1 mr-2" />
                  <div>
                    <div>通用对话</div>
                    <div className="text-xs text-gray-500">适用于一般问答和交流</div>
                  </div>
                </div>
              </Radio.Button>

              <Radio.Button value="customer-service" className="h-auto text-left p-2">
                <div className="flex items-start">
                  <CustomerServiceOutlined className="mt-1 mr-2" />
                  <div>
                    <div>智能客服系统</div>
                    <div className="text-xs text-gray-500">处理客户咨询和问题</div>
                  </div>
                </div>
              </Radio.Button>

              <Radio.Button value="dashboard" className="h-auto text-left p-2">
                <div className="flex items-start">
                  <DashboardOutlined className="mt-1 mr-2" />
                  <div>
                    <div>动态数据仪表板</div>
                    <div className="text-xs text-gray-500">数据可视化和分析</div>
                  </div>
                </div>
              </Radio.Button>

              <Radio.Button value="doc-generation" className="h-auto text-left p-2">
                <div className="flex items-start">
                  <FileTextOutlined className="mt-1 mr-2" />
                  <div>
                    <div>自动化文档生成</div>
                    <div className="text-xs text-gray-500">创建和格式化文档</div>
                  </div>
                </div>
              </Radio.Button>

              <Radio.Button value="data-pipeline" className="h-auto text-left p-2" style={{ gridColumn: '1 / span 2' }}>
                <div className="flex items-start">
                  <ApiOutlined className="mt-1 mr-2" />
                  <div>
                    <div>实时数据分析管道</div>
                    <div className="text-xs text-gray-500">配置和监控数据处理流程</div>
                  </div>
                </div>
              </Radio.Button>
            </div>
          </Radio.Group>
        </div>
      </Modal>
    </div>
  );
}
