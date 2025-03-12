'use client';

import { useState, useRef, useEffect } from 'react';
import { Button, Tooltip, Dropdown, Space, Menu, Divider } from 'antd';
import {
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  StrikethroughOutlined,
  OrderedListOutlined,
  UnorderedListOutlined,
  AlignLeftOutlined,
  AlignCenterOutlined,
  AlignRightOutlined,
  LinkOutlined,
  PictureOutlined,
  CodeOutlined,
  FontColorsOutlined,
  BgColorsOutlined,
  ClearOutlined,
  UndoOutlined,
  RedoOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
} from '@ant-design/icons';

// 添加CSS样式
import './RichTextEditor.css';

interface RichTextEditorProps {
  onChange: (html: string) => void;
  initialValue?: string;
  placeholder?: string;
  minHeight?: number;
  maxHeight?: number;
}

export default function RichTextEditor({
  onChange,
  initialValue = '',
  placeholder = '输入消息...',
  minHeight = 100,
  maxHeight = 300,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);

  // 初始化编辑器
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = initialValue;
      editorRef.current.focus();
    }
  }, [initialValue]);

  // 监听内容变化
  useEffect(() => {
    const handleInput = () => {
      if (editorRef.current) {
        onChange(editorRef.current.innerHTML);
      }
    };

    if (editorRef.current) {
      editorRef.current.addEventListener('input', handleInput);
    }

    return () => {
      if (editorRef.current) {
        editorRef.current.removeEventListener('input', handleInput);
      }
    };
  }, [onChange]);

  // 处理全屏模式
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isFullscreen]);

  // 工具栏按钮执行命令
  const execCommand = (command: string, value: string = '') => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
      onChange(editorRef.current.innerHTML);
    }
  };

  // 应用文本样式
  const applyTextStyle = (command: string) => {
    execCommand(command);
  };

  // 插入链接
  const insertLink = () => {
    const selection = window.getSelection();
    if (selection && selection.toString()) {
      setShowLinkInput(true);
    } else {
      alert('请先选择要添加链接的文本');
    }
  };

  // 创建链接
  const createLink = () => {
    if (linkUrl) {
      execCommand('createLink', linkUrl);
      setShowLinkInput(false);
      setLinkUrl('');
    }
  };

  // 插入代码块
  const insertCodeBlock = () => {
    const selection = window.getSelection();
    if (selection && selection.toString()) {
      const code = selection.toString();
      const codeBlock = `<pre><code>${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`;
      document.execCommand('insertHTML', false, codeBlock);
    } else {
      const codeBlock = '<pre><code>// 在这里输入代码</code></pre>';
      document.execCommand('insertHTML', false, codeBlock);
    }
    
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  // 颜色菜单项
  const colorMenuItems = [
    { key: '#000000', label: '黑色', color: '#000000' },
    { key: '#FF0000', label: '红色', color: '#FF0000' },
    { key: '#00FF00', label: '绿色', color: '#00FF00' },
    { key: '#0000FF', label: '蓝色', color: '#0000FF' },
    { key: '#FFFF00', label: '黄色', color: '#FFFF00' },
    { key: '#FF00FF', label: '紫色', color: '#FF00FF' },
    { key: '#00FFFF', label: '青色', color: '#00FFFF' },
    { key: '#FFA500', label: '橙色', color: '#FFA500' },
  ];

  // 字体颜色菜单
  const textColorMenu = (
    <Menu onClick={({ key }) => execCommand('foreColor', key.toString())}>
      {colorMenuItems.map(item => (
        <Menu.Item key={item.key}>
          <div className="flex items-center">
            <div className="w-4 h-4 mr-2" style={{ backgroundColor: item.color }}></div>
            {item.label}
          </div>
        </Menu.Item>
      ))}
    </Menu>
  );

  // 背景颜色菜单
  const bgColorMenu = (
    <Menu onClick={({ key }) => execCommand('hiliteColor', key.toString())}>
      {colorMenuItems.map(item => (
        <Menu.Item key={item.key}>
          <div className="flex items-center">
            <div className="w-4 h-4 mr-2" style={{ backgroundColor: item.color }}></div>
            {item.label}
          </div>
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <div className={`rich-text-editor ${isFullscreen ? 'fixed inset-0 z-50 bg-white' : ''}`}>
      {/* 工具栏 */}
      <div className="toolbar flex flex-wrap items-center border border-gray-300 rounded-t-md p-1 bg-gray-50 space-x-1">
        <Tooltip title="加粗">
          <Button type="text" icon={<BoldOutlined />} onClick={() => applyTextStyle('bold')} />
        </Tooltip>
        <Tooltip title="斜体">
          <Button type="text" icon={<ItalicOutlined />} onClick={() => applyTextStyle('italic')} />
        </Tooltip>
        <Tooltip title="下划线">
          <Button type="text" icon={<UnderlineOutlined />} onClick={() => applyTextStyle('underline')} />
        </Tooltip>
        <Tooltip title="删除线">
          <Button type="text" icon={<StrikethroughOutlined />} onClick={() => applyTextStyle('strikeThrough')} />
        </Tooltip>
        
        <Divider type="vertical" />
        
        <Tooltip title="有序列表">
          <Button type="text" icon={<OrderedListOutlined />} onClick={() => execCommand('insertOrderedList')} />
        </Tooltip>
        <Tooltip title="无序列表">
          <Button type="text" icon={<UnorderedListOutlined />} onClick={() => execCommand('insertUnorderedList')} />
        </Tooltip>
        
        <Divider type="vertical" />
        
        <Tooltip title="左对齐">
          <Button type="text" icon={<AlignLeftOutlined />} onClick={() => execCommand('justifyLeft')} />
        </Tooltip>
        <Tooltip title="居中对齐">
          <Button type="text" icon={<AlignCenterOutlined />} onClick={() => execCommand('justifyCenter')} />
        </Tooltip>
        <Tooltip title="右对齐">
          <Button type="text" icon={<AlignRightOutlined />} onClick={() => execCommand('justifyRight')} />
        </Tooltip>
        
        <Divider type="vertical" />
        
        <Tooltip title="添加链接">
          <Button type="text" icon={<LinkOutlined />} onClick={insertLink} />
        </Tooltip>
        <Tooltip title="插入代码">
          <Button type="text" icon={<CodeOutlined />} onClick={insertCodeBlock} />
        </Tooltip>
        
        <Divider type="vertical" />
        
        <Dropdown overlay={textColorMenu} placement="bottomLeft">
          <Button type="text" icon={<FontColorsOutlined />} />
        </Dropdown>
        <Dropdown overlay={bgColorMenu} placement="bottomLeft">
          <Button type="text" icon={<BgColorsOutlined />} />
        </Dropdown>
        
        <Divider type="vertical" />
        
        <Tooltip title="撤销">
          <Button type="text" icon={<UndoOutlined />} onClick={() => execCommand('undo')} />
        </Tooltip>
        <Tooltip title="重做">
          <Button type="text" icon={<RedoOutlined />} onClick={() => execCommand('redo')} />
        </Tooltip>
        <Tooltip title="清除格式">
          <Button type="text" icon={<ClearOutlined />} onClick={() => execCommand('removeFormat')} />
        </Tooltip>
        
        <div className="flex-grow"></div>
        
        <Tooltip title={isFullscreen ? "退出全屏" : "全屏编辑"}>
          <Button
            type="text"
            icon={isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
            onClick={() => setIsFullscreen(!isFullscreen)}
          />
        </Tooltip>
      </div>
      
      {/* 链接输入框 */}
      {showLinkInput && (
        <div className="p-2 bg-gray-50 border-l border-r border-gray-300 flex">
          <input
            type="text"
            className="flex-grow border p-1"
            placeholder="输入URL链接"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
          />
          <Button type="primary" size="small" onClick={createLink} className="ml-2">
            确定
          </Button>
          <Button size="small" onClick={() => setShowLinkInput(false)} className="ml-2">
            取消
          </Button>
        </div>
      )}
      
      {/* 编辑区域 */}
      <div
        ref={editorRef}
        contentEditable
        className="border border-t-0 border-gray-300 rounded-b-md p-2 focus:outline-none overflow-auto rich-text-editor"
        style={{
          minHeight: isFullscreen ? 'calc(100vh - 120px)' : `${minHeight}px`,
          maxHeight: isFullscreen ? 'calc(100vh - 120px)' : `${maxHeight}px`,
        }}
        data-placeholder={placeholder}
        onKeyDown={(e) => {
          if (e.key === 'Tab') {
            e.preventDefault();
            execCommand('insertHTML', '&nbsp;&nbsp;&nbsp;&nbsp;');
          }
        }}
      ></div>
    </div>
  );
}
