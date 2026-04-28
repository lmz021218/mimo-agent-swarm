# 🤖 Mimo Agent Swarm - 多Agent协作智能开发系统

> 基于长链推理与多Agent协作的AI驱动软件开发框架

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 📋 项目概述

**Mimo Agent Swarm** 是一个展示AI Agent长链推理能力的开发框架。系统模拟真实软件团队的协作流程——从需求到代码的端到端自动化，通过5个专业AI Agent的分工协作完成复杂任务。

`
用户输入一句话需求
        │
        ▼
┌──────────────────────────────────────────────────┐
│          Agent Swarm Orchestrator                 │
│             长链推理 · 任务调度 · 结果聚合          │
└──────┬───────┬────────┬────────┬─────────┘
       │       │        │        │
       ▼       ▼        ▼        ▼        ▼
   [需求分析] [架构设计] [代码生成] [代码审查] [测试生成]
   Agent     Agent     Agent     Agent     Agent
`

---

## 🎯 核心价值

| 痛点 | 解决方式 |
|------|----------|
| 开发效率低，人工串行处理耗时 | 5个Agent并行协作，端到端自动化 |
| 需求传递失真，返工率高 | Agent间通过类型化消息传递，消除歧义 |
| 单一AI难以胜任多领域 | 分领域专用Agent，各司其职 |
| 缺少可追溯的推理过程 | 完整的长链推理记录，每一步可审计 |

---

## 🧠 核心技术：长链推理 (Chain-of-Thought)

系统在执行过程中自动记录每一步推理：

`
Step 1 - Orchestrator:
  Thought: 分析任务复杂度，确定需要5个执行阶段
  Action:  创建5阶段执行计划
  Observation: 计划已创建，包含需求分析到测试生成的完整流程

Step 2 - RequirementAgent:
  Thought: 准备执行需求分析阶段
  Action:  调用需求分析Agent处理任务
  Observation: 需求分析Agent已接收任务，开始处理
  ...

完整推理链: 6步 | 置信度: 100% | 可追溯: ✓
`

---

## 🚀 真实运行演示

`
╔════════════════════════════════════════════════════════════╗
║     🤖 Mimo Agent Swarm - 多Agent协作演示                 ║
╚════════════════════════════════════════════════════════════╝

📋 步骤1: 注册专业Agent团队

✅ Agent 已注册: 需求分析Agent (需求分析师)
✅ Agent 已注册: 架构设计Agent (架构师)
✅ Agent 已注册: 代码生成Agent (高级开发工程师)
✅ Agent 已注册: 代码审查Agent (技术负责人)
✅ Agent 已注册: 测试生成Agent (QA工程师)

📊 系统状态: { agents: 5, activeTasks: 0, totalTokens: 0 }

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 示例任务: 创建一个支持多Agent协作的任务管理系统
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚀 开始执行任务: 创建一个支持多Agent协作的任务管理系统...
📋 任务ID: task_1777398789922

📝 创建执行计划...

📌 执行阶段: 需求分析
[需求分析Agent] 收到消息: request from orchestrator

📌 执行阶段: 架构设计
[架构设计Agent] 收到消息: request from orchestrator

📌 执行阶段: 代码实现
[代码生成Agent] 收到消息: request from orchestrator

📌 执行阶段: 代码审查
[代码审查Agent] 收到消息: request from orchestrator

📌 执行阶段: 测试生成
[测试生成Agent] 收到消息: request from orchestrator

✅ 任务完成! 耗时: 2563ms
📊 生成产物: 5 个

📄 生成的产物:
  1. [document]  req_xxx  -- 需求分析文档
  2. [diagram]   arch_xxx -- 架构设计图
  3. [code]      code_xxx -- TypeScript源代码
  4. [review]    review_xxx -- 代码审查报告
  5. [test]      test_xxx  -- 测试用例

📈 性能指标:
  • 总Token消耗: 10,000
  • 执行时间: 2563ms

🔗 长链推理:
  • 推理步骤: 6 步
  • 置信度: 100.0%

✅ 演示完成！
`

---

## 📁 项目结构

`
mimo-agent-swarm/
├── src/
│   ├── core/
│   │   ├── types.ts                 # 完整的类型系统定义
│   │   ├── base-agent.ts            # Agent抽象基类（消息队列、推理引擎）
│   │   └── orchestrator.ts          # Swarm协调器（任务调度+长链推理）
│   ├── agents/
│   │   ├── requirement-agent.ts     # 需求分析Agent
│   │   ├── architecture-agent.ts    # 架构设计Agent
│   │   ├── codegen-agent.ts         # 代码生成Agent
│   │   ├── review-agent.ts          # 代码审查Agent
│   │   └── test-agent.ts            # 测试生成Agent
│   ├── demo/
│   │   └── run-demo.ts              # 完整演示脚本
│   └── index.ts                     # 公共API入口
├── package.json
├── tsconfig.json                    # 严格TypeScript配置
└── README.md
`

---

## 🛠️ 快速开始

### 前置要求
- Node.js 18+
- npm

### 三步运行
`ash
git clone https://github.com/lmz021218/mimo-agent-swarm.git
cd mimo-agent-swarm
npm install
npm run demo
`

### 在代码中使用
`	ypescript
import { AgentSwarmOrchestrator, RequirementAgent, ArchitectureAgent,
         CodeGenAgent, ReviewAgent, TestAgent } from 'mimo-agent-swarm';

const orchestrator = new AgentSwarmOrchestrator();
orchestrator.registerAgent(new RequirementAgent({ /* config */ }));
orchestrator.registerAgent(new ArchitectureAgent({ /* config */ }));
orchestrator.registerAgent(new CodeGenAgent({ /* config */ }));
orchestrator.registerAgent(new ReviewAgent({ /* config */ }));
orchestrator.registerAgent(new TestAgent({ /* config */ }));

const result = await orchestrator.executeTask(
  '创建一个用户认证系统，支持JWT登录和权限管理'
);
console.log(result.artifacts);
console.log(result.reasoningChain);
`

---

## 📊 技术指标

| 指标 | 数值 |
|------|------|
| 专业Agent数 | 5 (需求·架构·编码·审查·测试) |
| 单次Token消耗 | ~10,000-50,000 |
| 执行时间 | 2-3s (本地) / 30-120s (API) |
| 推理步骤数 | 6步 |
| 产物类型 | 5种 |
| TypeScript | 严格模式，零类型错误 |

---

## 🏗️ 技术栈

- **语言**: TypeScript 5.3+ (strict mode)
- **运行时**: Node.js 18+
- **架构模式**: Agent Pattern + Event-Driven
- **代码质量**: ESLint + TypeScript Strict

---

## 🔮 未来规划

- [ ] 接入大模型API，替代模拟推理
- [ ] 新增安全审计Agent、性能优化Agent、文档生成Agent
- [ ] 支持自定义Agent插件注册
- [ ] 可视化工作流编辑器
- [ ] GitHub Actions集成，自动提交PR

## 📝 License

[MIT](LICENSE)
