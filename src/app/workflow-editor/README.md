# Dify 工作流可视化编辑器

## 项目概述

Dify 工作流可视化编辑器是一个基于 React Flow 的拖拽式工作流设计工具，旨在帮助用户直观地设计和管理复杂的 AI 工作流。该编辑器支持多种节点类型、连接方式和配置选项，使用户能够轻松构建各种 AI 工作流场景。

## 核心功能

1. **画布拖拽功能**：支持节点拖放、网格对齐和自动布局
2. **节点连接线管理**：创建、编辑和删除连接线，支持多种连线样式（直线、曲线、折线等）
3. **节点配置面板**：为不同类型的节点提供专用配置界面
4. **工作流验证**：检查工作流的完整性和连接有效性
5. **模板库**：提供常用工作流模板，便于快速创建
6. **导入/导出**：支持将工作流导出为 JSON 或图片格式
7. **实时状态展示**：可视化展示工作流执行状态和数据流向
8. **撤销/重做功能**：支持操作历史管理

## 节点类型

- **触发器节点**：工作流的起点，包括手动触发、定时触发、Webhook 等
- **AI 节点**：集成 AI 模型处理数据
- **条件节点**：根据条件分支工作流
- **数据源节点**：从外部数据源获取数据
- **输出节点**：将处理结果输出到指定目标

## 使用方法

1. 从左侧菜单栏拖拽节点到画布
2. 连接节点以创建工作流
3. 点击节点或连线进行配置
4. 使用顶部工具栏保存、验证或导出工作流
5. 选择预定义模板可快速创建常用工作流

## 技术实现

- 基于 React Flow 实现画布和节点交互
- 使用 TypeScript 确保代码类型安全
- 支持自定义节点和边样式
- 使用 HTML5 Canvas 导出工作流为图片
- JSON 格式支持工作流的序列化和反序列化

## 系统要求

- Node.js 16+
- React 18+
- 现代浏览器（Chrome, Firefox, Safari, Edge）

## 未来规划

- 增加更多节点类型和配置选项
- 支持节点分组和折叠功能
- 实现工作流执行模拟功能
- 增强移动端适配性
- 支持协作编辑功能
