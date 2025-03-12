import { ChatMessage, ChatSession } from './types';

// 模拟聊天会话
export const mockSessions: ChatSession[] = [
  {
    id: 'session-1',
    name: '智能客服会话',
    scenario: 'customer-service',
    createdAt: '2025-03-10T08:30:00Z',
    lastMessage: '我们已经收到您的问题，正在处理中',
    unreadCount: 0
  },
  {
    id: 'session-2',
    name: '数据分析仪表板',
    scenario: 'dashboard',
    createdAt: '2025-03-09T14:20:00Z',
    lastMessage: '已生成销售数据可视化报表',
    unreadCount: 2
  },
  {
    id: 'session-3',
    name: '自动文档生成',
    scenario: 'doc-generation',
    createdAt: '2025-03-08T09:15:00Z',
    lastMessage: '文档模板已准备完成',
    unreadCount: 0
  },
  {
    id: 'session-4',
    name: '实时数据管道配置',
    scenario: 'data-pipeline',
    createdAt: '2025-03-07T16:40:00Z',
    lastMessage: '数据处理流程已更新',
    unreadCount: 1
  },
  {
    id: 'session-5',
    name: '通用对话',
    scenario: 'general',
    createdAt: '2025-03-06T10:05:00Z',
    lastMessage: '有什么我可以帮助您的？',
    unreadCount: 0
  }
];

// 模拟聊天消息
export const mockMessages: ChatMessage[] = [
  // 智能客服会话消息
  {
    id: 'msg-1-1',
    sessionId: 'session-1',
    sender: 'user',
    content: '以下是按产品类别的销售分析：\n\n```chart\n{\n  "type": "pie",\n  "data": {\n    "labels": ["电子产品", "家居用品", "服装", "食品", "其他"],\n    "datasets": [{\n      "data": [35, 25, 22, 15, 3],\n      "backgroundColor": [\n        "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"\n      ]\n    }]\n  }\n}\n```\n\n电子产品占比最高达35%，其次是家居用品25%。要查看具体产品的销售情况吗？',
    contentType: 'chart',
    timestamp: '2025-03-10T08:30:00Z',
    status: 'delivered'
  },
  {
    id: 'msg-1-2',
    sessionId: 'session-1',
    sender: 'ai',
    content: '以下是按产品类别的销售分析：\n\n```chart\n{\n  "type": "pie",\n  "data": {\n    "labels": ["电子产品", "家居用品", "服装", "食品", "其他"],\n    "datasets": [{\n      "data": [35, 25, 22, 15, 3],\n      "backgroundColor": [\n        "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"\n      ]\n    }]\n  }\n}\n```\n\n电子产品占比最高达35%，其次是家居用品25%。要查看具体产品的销售情况吗？',
    contentType: 'chart',
    timestamp: '2025-03-10T08:30:30Z',
    status: 'delivered'
  },
  {
    id: 'msg-1-3',
    sessionId: 'session-1',
    sender: 'user',
    content: '以下是按产品类别的销售分析：\n\n```chart\n{\n  "type": "pie",\n  "data": {\n    "labels": ["电子产品", "家居用品", "服装", "食品", "其他"],\n    "datasets": [{\n      "data": [35, 25, 22, 15, 3],\n      "backgroundColor": [\n        "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"\n      ]\n    }]\n  }\n}\n```\n\n电子产品占比最高达35%，其次是家居用品25%。要查看具体产品的销售情况吗？',
    contentType: 'chart',
    timestamp: '2025-03-10T08:31:15Z',
    status: 'delivered'
  },
  {
    id: 'msg-1-4',
    sessionId: 'session-1',
    sender: 'ai',
    content: '以下是按产品类别的销售分析：\n\n```chart\n{\n  "type": "pie",\n  "data": {\n    "labels": ["电子产品", "家居用品", "服装", "食品", "其他"],\n    "datasets": [{\n      "data": [35, 25, 22, 15, 3],\n      "backgroundColor": [\n        "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"\n      ]\n    }]\n  }\n}\n```\n\n电子产品占比最高达35%，其次是家居用品25%。要查看具体产品的销售情况吗？',
    contentType: 'chart',
    timestamp: '2025-03-10T08:31:45Z',
    status: 'delivered'
  },

  // 数据仪表板会话消息
  {
    id: 'msg-2-1',
    sessionId: 'session-2',
    sender: 'user',
    content: '请生成过去30天的销售趋势图',
    contentType: 'text',
    timestamp: '2025-03-09T14:20:00Z',
    status: 'delivered'
  },
  {
    id: 'msg-2-2',
    sessionId: 'session-2',
    sender: 'ai',
    content: '已为您生成过去30天的销售趋势图：\n\n```chart\n{\n  "type": "line",\n  "data": {\n    "labels": ["1日", "5日", "10日", "15日", "20日", "25日", "30日"],\n    "datasets": [{\n      "label": "销售额(万元)",\n      "data": [12, 19, 15, 22, 24, 18, 27],\n      "borderColor": "rgb(75, 192, 192)",\n      "tension": 0.1\n    }]\n  }\n}\n```\n\n销售额呈现稳步上升趋势，其中第15日和第30日有明显增长。需要更详细的分析吗？',
    contentType: 'chart',
    timestamp: '2025-03-09T14:20:30Z',
    status: 'delivered'
  },
  {
    id: 'msg-2-3',
    sessionId: 'session-2',
    sender: 'user',
    content: '请按产品类别分析销售情况',
    contentType: 'text',
    timestamp: '2025-03-09T14:21:15Z',
    status: 'delivered'
  },
  {
    id: 'msg-2-4',
    sessionId: 'session-2',
    sender: 'ai',
    content: '以下是按产品类别的销售分析：\n\n```chart\n{\n  "type": "pie",\n  "data": {\n    "labels": ["电子产品", "家居用品", "服装", "食品", "其他"],\n    "datasets": [{\n      "data": [35, 25, 22, 15, 3],\n      "backgroundColor": [\n        "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"\n      ]\n    }]\n  }\n}\n```\n\n电子产品占比最高达35%，其次是家居用品25%。要查看具体产品的销售情况吗？',
    contentType: 'chart',
    timestamp: '2025-03-09T14:21:45Z',
    status: 'delivered'
  },

  // 文档生成会话消息
  {
    id: 'msg-3-1',
    sessionId: 'session-3',
    sender: 'user',
    content: '帮我生成一份项目周报模板',
    contentType: 'text',
    timestamp: '2025-03-08T09:15:00Z',
    status: 'delivered'
  },
  {
    id: 'msg-3-2',
    sessionId: 'session-3',
    sender: 'ai',
    content: '已为您生成项目周报模板：\n\n# 项目周报\n\n**报告日期**：[日期]\n\n**项目名称**：[项目名称]\n\n**项目负责人**：[姓名]\n\n## 一、本周工作进展\n\n1. **已完成工作**\n   - 任务1：[描述]，完成度[百分比]\n   - 任务2：[描述]，完成度[百分比]\n\n2. **进行中工作**\n   - 任务3：[描述]，进度[百分比]\n   - 任务4：[描述]，进度[百分比]\n\n3. **计划开始工作**\n   - 任务5：[描述]，计划开始时间[日期]\n\n## 二、风险与问题\n\n| 问题描述 | 影响级别 | 解决方案 | 责任人 | 期限 |\n|---------|---------|---------|--------|------|\n| [问题1] | [高/中/低] | [方案] | [姓名] | [日期] |\n| [问题2] | [高/中/低] | [方案] | [姓名] | [日期] |\n\n## 三、下周工作计划\n\n1. [计划1]\n2. [计划2]\n3. [计划3]\n\n## 四、资源需求\n\n- 人力资源：[描述]\n- 设备资源：[描述]\n- 其他支持：[描述]\n\n## 五、项目关键指标\n\n- 进度指标：[描述]\n- 质量指标：[描述]\n- 成本指标：[描述]\n\n**附件**：[附件名称]\n\n请问是否需要调整模板内容？',
    contentType: 'md',
    timestamp: '2025-03-08T09:15:30Z',
    status: 'delivered'
  },
  {
    id: 'msg-3-3',
    sessionId: 'session-3',
    sender: 'user',
    content: '很好，能否增加一个项目亮点部分？',
    contentType: 'text',
    timestamp: '2025-03-08T09:16:15Z',
    status: 'delivered'
  },
  {
    id: 'msg-3-4',
    sessionId: 'session-3',
    sender: 'ai',
    content: '已为您添加项目亮点部分：\n\n# 项目周报\n\n**报告日期**：[日期]\n\n**项目名称**：[项目名称]\n\n**项目负责人**：[姓名]\n\n## 一、本周工作进展\n\n1. **已完成工作**\n   - 任务1：[描述]，完成度[百分比]\n   - 任务2：[描述]，完成度[百分比]\n\n2. **进行中工作**\n   - 任务3：[描述]，进度[百分比]\n   - 任务4：[描述]，进度[百分比]\n\n3. **计划开始工作**\n   - 任务5：[描述]，计划开始时间[日期]\n\n## 二、项目亮点\n\n- **创新点**：[描述项目创新之处]\n- **突破**：[描述克服的重要障碍]\n- **效率提升**：[描述效率提升的量化数据]\n- **客户反馈**：[描述积极的客户反馈]\n\n## 三、风险与问题\n\n| 问题描述 | 影响级别 | 解决方案 | 责任人 | 期限 |\n|---------|---------|---------|--------|------|\n| [问题1] | [高/中/低] | [方案] | [姓名] | [日期] |\n| [问题2] | [高/中/低] | [方案] | [姓名] | [日期] |\n\n## 四、下周工作计划\n\n1. [计划1]\n2. [计划2]\n3. [计划3]\n\n## 五、资源需求\n\n- 人力资源：[描述]\n- 设备资源：[描述]\n- 其他支持：[描述]\n\n## 六、项目关键指标\n\n- 进度指标：[描述]\n- 质量指标：[描述]\n- 成本指标：[描述]\n\n**附件**：[附件名称]\n\n模板已更新，添加了"项目亮点"部分，您可以在此处突出项目的创新点、突破、效率提升和客户反馈。还需要其他修改吗？',
    contentType: 'md',
    timestamp: '2025-03-08T09:16:45Z',
    status: 'delivered'
  },

  // 数据管道会话消息
  {
    id: 'msg-4-1',
    sessionId: 'session-4',
    sender: 'user',
    content: '如何配置实时数据处理流程?',
    contentType: 'text',
    timestamp: '2025-03-07T16:40:00Z',
    status: 'delivered'
  },
  {
    id: 'msg-4-2',
    sessionId: 'session-4',
    sender: 'ai',
    content: '要配置实时数据处理流程，您需要执行以下步骤：\n\n1. **数据源配置**\n   - 选择数据来源（API、数据库、消息队列等）\n   - 设置数据采集频率\n   - 配置鉴权和连接参数\n\n2. **处理节点设置**\n   ```python\n   # 示例数据处理节点配置\n   def process_data(data):\n       # 清洗数据\n       cleaned_data = remove_nulls(data)\n       # 转换数据结构\n       transformed_data = transform_structure(cleaned_data)\n       # 计算聚合指标\n       aggregated_data = calculate_metrics(transformed_data)\n       return aggregated_data\n   ```\n\n3. **输出端配置**\n   - 数据存储位置\n   - 输出格式\n   - 警报规则\n\n4. **监控和日志设置**\n   - 性能指标监控\n   - 错误处理策略\n   - 日志级别和保留策略\n\n您想了解哪个部分的详细信息？',
    contentType: 'md',
    timestamp: '2025-03-07T16:40:30Z',
    status: 'delivered'
  },
  {
    id: 'msg-4-3',
    sessionId: 'session-4',
    sender: 'user',
    content: '请详细解释数据聚合配置',
    contentType: 'text',
    timestamp: '2025-03-07T16:41:15Z',
    status: 'delivered'
  },
  {
    id: 'msg-4-4',
    sessionId: 'session-4',
    sender: 'ai',
    content: '## 数据聚合配置详解\n\n数据聚合是将多条记录合并为汇总信息的过程，配置时需要考虑以下几点：\n\n### 1. 聚合类型选择\n\n```python\n# 聚合计算函数示例\ndef calculate_aggregations(data, group_by_fields, aggregations):\n    result = {}\n    for group, entries in groupby(data, key=lambda x: tuple(x[f] for f in group_by_fields)):\n        group_data = list(entries)\n        group_key = "_".join(str(g) for g in group)\n        result[group_key] = {}\n        \n        for agg in aggregations:\n            field = agg["field"]\n            func = agg["function"]\n            \n            if func == "sum":\n                result[group_key][f"{field}_sum"] = sum(e[field] for e in group_data)\n            elif func == "avg":\n                result[group_key][f"{field}_avg"] = sum(e[field] for e in group_data) / len(group_data)\n            elif func == "max":\n                result[group_key][f"{field}_max"] = max(e[field] for e in group_data)\n            elif func == "min":\n                result[group_key][f"{field}_min"] = min(e[field] for e in group_data)\n            elif func == "count":\n                result[group_key][f"{field}_count"] = len(group_data)\n    \n    return result\n```\n\n### 2. 时间窗口设置\n\n| 窗口类型 | 适用场景 | 配置参数 |\n|---------|---------|--------|\n| 滚动窗口 | 不重叠的固定时间段 | `window_size_seconds` |\n| 滑动窗口 | 重叠的时间段 | `window_size_seconds`, `slide_interval_seconds` |\n| 会话窗口 | 活动间隙分组 | `session_gap_seconds` |\n\n### 3. 增量聚合优化\n\n对于大数据量处理，建议使用增量聚合而非完全重计算：\n\n```python\n# 增量聚合示例\nclass IncrementalAggregator:\n    def __init__(self, aggregation_type):\n        self.aggregation_type = aggregation_type\n        self.state = {}\n    \n    def add_data(self, key, value):\n        if key not in self.state:\n            if self.aggregation_type == "sum":\n                self.state[key] = value\n            elif self.aggregation_type == "count":\n                self.state[key] = 1\n            elif self.aggregation_type == "avg":\n                self.state[key] = {"sum": value, "count": 1}\n            # 其他聚合类型...\n        else:\n            if self.aggregation_type == "sum":\n                self.state[key] += value\n            elif self.aggregation_type == "count":\n                self.state[key] += 1\n            elif self.aggregation_type == "avg":\n                self.state[key]["sum"] += value\n                self.state[key]["count"] += 1\n    \n    def get_result(self, key):\n        if self.aggregation_type == "avg":\n            return self.state[key]["sum"] / self.state[key]["count"]\n        return self.state[key]\n```\n\n### 4. 聚合配置示例\n\n```json\n{\n  "groupBy": ["region", "product_category"],\n  "aggregations": [\n    {"field": "sales_amount", "function": "sum"},\n    {"field": "order_count", "function": "count"},\n    {"field": "unit_price", "function": "avg"}\n  ],\n  "windowSettings": {\n    "type": "sliding",\n    "size": 300,\n    "slide": 60\n  }\n}\n```\n\n这样的配置会按区域和产品类别分组，计算销售额总和、订单数量和平均单价，使用5分钟的滑动窗口，每1分钟滑动一次。\n\n您需要根据具体业务场景调整这些参数。还有其他问题吗？',
    contentType: 'md',
    timestamp: '2025-03-07T16:41:45Z',
    status: 'delivered'
  },

  // 通用会话消息
  {
    id: 'msg-5-1',
    sessionId: 'session-5',
    sender: 'user',
    content: '你好，今天的天气怎么样？',
    contentType: 'text',
    timestamp: '2025-03-06T10:05:00Z',
    status: 'delivered'
  },
  {
    id: 'msg-5-2',
    sessionId: 'session-5',
    sender: 'ai',
    content: '以下是按产品类别的销售分析：\n\n```chart\n{\n  "type": "pie",\n  "data": {\n    "labels": ["电子产品", "家居用品", "服装", "食品", "其他"],\n    "datasets": [{\n      "data": [35, 25, 22, 15, 3],\n      "backgroundColor": [\n        "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"\n      ]\n    }]\n  }\n}\n```\n\n电子产品占比最高达35%，其次是家居用品25%。要查看具体产品的销售情况吗？',
    contentType: 'chart',
    timestamp: '2025-03-06T10:05:30Z',
    status: 'delivered'
  }
];
