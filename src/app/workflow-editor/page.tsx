'use client';

import React from 'react';
import WorkflowEditor from './components/WorkflowEditor';
import './workflow-editor.css';
import { FiActivity } from 'react-icons/fi';

export default function WorkflowEditorPage() {
  return (
    <div className="workflow-editor-page">
      <div className="workflow-editor-header">
        <div className="workflow-editor-header-left">
          <div className="workflow-editor-logo">
            <FiActivity size={20} />
          </div>
          <div className="workflow-editor-title">工作流编辑器</div>
        </div>
        <div className="workflow-editor-header-right">
          <button className="header-button secondary-button">
            <span>文档</span>
          </button>
          <button className="header-button primary-button">
            <span>保存</span>
          </button>
        </div>
      </div>
      <WorkflowEditor />
    </div>
  );
}
