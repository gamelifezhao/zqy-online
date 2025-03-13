'use client';

import React from 'react';
import { PerformanceDashboard } from './components';
import './dashboard.css';

/**
 * Dify 应用性能分析仪表板页面
 * 支持动态数据仪表板和实时数据分析管道应用场景
 */
export default function DashboardPage() {
  return (
    <div className="dashboard-page">
      <PerformanceDashboard />
    </div>
  );
}

// 导出组件以便在其他地方直接使用
export { PerformanceDashboard } from './components';
