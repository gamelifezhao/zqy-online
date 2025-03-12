'use client';

import { useState, useEffect } from 'react';
import { Button, message, Tooltip } from 'antd';
import { CopyOutlined, CheckOutlined } from '@ant-design/icons';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
// 导入基本语言
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-markup'; // HTML
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-kotlin';
import 'prismjs/components/prism-swift';
import 'prismjs/components/prism-ruby';
import 'prismjs/components/prism-php';
import 'prismjs/components/prism-scala';
import 'prismjs/components/prism-dart';
import 'prismjs/components/prism-graphql';
import 'prismjs/components/prism-powershell';
import 'prismjs/components/prism-r';
import 'prismjs/components/prism-docker';
import 'prismjs/components/prism-regex';
import 'prismjs/components/prism-haskell';
import 'prismjs/components/prism-lua';
import 'prismjs/components/prism-shell-session';

interface CodeBlockProps {
  code: string;
  language: string;
}

export default function CodeBlock({ code, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [actualCode, setActualCode] = useState('');
  const [actualLanguage, setActualLanguage] = useState('');

  // 提取代码内容
  useEffect(() => {
    // 检查是否是```code```格式的代码块
    const codeBlockPattern = /```(\w+)?\n([\s\S]*?)```/g;
    const match = codeBlockPattern.exec(code);
    
    if (match) {
      // 如果找到Markdown风格的代码块
      const detectedLanguage = match[1] || language || 'plaintext';
      setActualLanguage(normalizeLanguage(detectedLanguage));
      setActualCode(match[2].trim());
    } else {
      // 直接使用提供的代码
      setActualLanguage(normalizeLanguage(language || 'plaintext'));
      setActualCode(code);
    }
  }, [code, language]);

  // 规范化语言名称
  const normalizeLanguage = (lang: string): string => {
    // 标准化语言名称到Prism支持的标识符
    const langMap: Record<string, string> = {
      'js': 'javascript',
      'ts': 'typescript',
      'py': 'python',
      'html': 'markup',
      'xml': 'markup',
      'sh': 'bash',
      'shell': 'bash',
      'yml': 'yaml',
      'plaintext': 'plaintext',
      'text': 'plaintext'
    };
    
    return langMap[lang.toLowerCase()] || lang.toLowerCase();
  };

  // 高亮代码
  useEffect(() => {
    if (actualLanguage && actualCode) {
      // 确保语言已加载
      if (actualLanguage !== 'plaintext' && Prism.languages[actualLanguage]) {
        Prism.highlightAll();
      }
    }
  }, [actualLanguage, actualCode]);

  // 复制代码到剪贴板
  const copyToClipboard = () => {
    navigator.clipboard.writeText(actualCode)
      .then(() => {
        setCopied(true);
        message.success('代码已复制到剪贴板');
        
        // 3秒后重置复制状态
        setTimeout(() => {
          setCopied(false);
        }, 3000);
      })
      .catch(() => {
        message.error('复制失败，请手动复制');
      });
  };

  // 获取语言显示名称
  const getLanguageDisplayName = (lang: string): string => {
    const langDisplayMap: Record<string, string> = {
      'javascript': 'JavaScript',
      'typescript': 'TypeScript',
      'python': 'Python',
      'java': 'Java',
      'csharp': 'C#',
      'markup': 'HTML',
      'css': 'CSS',
      'bash': 'Bash',
      'json': 'JSON',
      'yaml': 'YAML',
      'markdown': 'Markdown',
      'sql': 'SQL',
      'go': 'Go',
      'rust': 'Rust',
      'kotlin': 'Kotlin',
      'swift': 'Swift',
      'ruby': 'Ruby',
      'php': 'PHP',
      'plaintext': '纯文本'
    };
    
    return langDisplayMap[lang] || lang.charAt(0).toUpperCase() + lang.slice(1);
  };

  return (
    <div className="code-block relative rounded-lg overflow-hidden border border-gray-200 bg-gray-900 text-gray-100">
      {/* 代码块头部 */}
      <div className="flex justify-between items-center px-4 py-2 bg-gray-800 text-gray-200 text-xs">
        <span>{getLanguageDisplayName(actualLanguage)}</span>
        <Tooltip title={copied ? '已复制' : '复制代码'}>
          <Button 
            type="text"
            size="small"
            icon={copied ? <CheckOutlined /> : <CopyOutlined />}
            onClick={copyToClipboard}
            className="text-gray-300 hover:text-white"
          />
        </Tooltip>
      </div>
      
      {/* 代码内容 */}
      <pre className="p-4 m-0 overflow-x-auto" style={{ maxHeight: '400px' }}>
        <code className={`language-${actualLanguage}`}>
          {actualCode}
        </code>
      </pre>
    </div>
  );
}
