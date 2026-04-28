# Agent Swarm

> 五个 AI Agent 串行协作。给一句话，它跑完需求 → 架构 → 编码 → 审查 → 测试全流程，产物落到 `workspace/`。

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 它是干嘛的

这是五个各有专长的 Agent，串成一条线跑。你用自然语言描述一个需求，它依次调用 DeepSeek API，每个 Agent 把上一步的输出当输入，一路推进到最终产物。API 不可用时自动走 fallback，本地照样出结果。

```
你的需求："做一个命令行待办事项工具，支持增删查" 
  │
  ▼
需求分析 Agent  ──→  功能点、约束、验收标准
  │
  ▼
架构设计 Agent  ──→  技术栈、模块划分、数据流
  │
  ▼
代码生成 Agent  ──→  完整的 TypeScript 源码（严格的 strict mode）
  │
  ▼
代码审查 Agent  ──→  按严重程度分类的问题列表
  │
  ▼
测试生成 Agent  ──→  vitest 测试用例
  │
  ▼
workspace/ 目录 —— 五个文件，可直接看、可跑
```

---

## 和 OpenCode 的关系

这个项目**不是** OpenCode 插件。它是一组独立 Agent 类，你可以在任何 Node.js 项目里引入：

```typescript
import { AgentSwarmOrchestrator } from './src/core/orchestrator.js';
import { RequirementAgent } from './src/agents/requirement-agent.js';
// ... 其余四个同理

const orch = new AgentSwarmOrchestrator();
orch.registerAgent(new RequirementAgent(config));
// ...

const { artifacts } = await orch.executeTask('你的需求');
// artifacts[0] → 需求文档
// artifacts[3] → 审查报告，依此类推
```

如果你想把它塞进 OpenCode：把 Agent 类和 Orchestrator 复制到你的 OpenCode skill 目录，在 skill 里 `import` 并调用 `executeTask()` 就行。不需要改代码。

---

## 跑起来

```bash
git clone https://github.com/lmz021218/mimo-agent-swarm.git
cd mimo-agent-swarm
npm install

# 默认任务
npx tsx src/demo/run-demo.ts

# 自定义任务
npx tsx src/demo/run-demo.ts "写一个把 Markdown 转 HTML 的 CLI 工具"
```

需要 Node.js 18+。

---

## 真实运行结果

下面是用 DeepSeek API 跑了一次真实的输出（任务："统计目录下所有文件的行数"）：

```
Agent Swarm — 多Agent协作开发
目标：写一个 Node.js 命令行工具，用来统计目录下所有文件的行数

╔══════════════════════════════════════╗
║  任务: 写一个 Node.js 命令行工具...
╚══════════════════════════════════════╝

🤖 [需求分析] 开始工作...
   📤 发送请求 (56 chars)
   📝 功能：支持命令行参数指定目录、递归遍历、按行数排序、排除 node_modules...
   ✅ 完成 (421 chars)

🤖 [架构设计] 开始工作...
   📤 发送请求 (472 chars)
   📝 Node.js + fs/promises + path，cli.ts → counter.ts → fileFilter.ts...
   ✅ 完成 (1200 chars)

🤖 [代码生成] 开始工作...
   📤 发送请求 (1717 chars)
   📝 输出 5 个 TypeScript 文件：index.ts、cli.ts、counter.ts...
   ✅ 完成 (4516 chars)

🤖 [代码审查] 开始工作...
   📤 发送请求 (6228 chars)
   📝 🔴 fileFilter.ts 异步处理 bug / 🟡 空文件统计逻辑 / 🟢 排序健壮性
   ✅ 完成 (1131 chars)

🤖 [测试生成] 开始工作...
   📤 发送请求 (7369 chars)
   📝 425 行 vitest 用例，覆盖 cli、counter、filter、sorter
   ✅ 完成 (14553 chars)

📁 产物已保存到 workspace/
✅ 完成。耗时 79s，总产物 21,821 chars
```

五个文件都在 `workspace/` 目录里，可以直接打开看。

---

## 文件结构

```
├── src/
│   ├── core/
│   │   ├── types.ts            # Artifact、AgentConfig、ReasoningChain
│   │   ├── base-agent.ts       # execute() 调 LLM，fallback 兜底
│   │   ├── llm-client.ts       # DeepSeek 流式调用，兼容 OpenAI 格式
│   │   └── orchestrator.ts     # 串行调度，上下文传递，产物落盘
│   ├── agents/
│   │   ├── requirement-agent.ts
│   │   ├── architecture-agent.ts
│   │   ├── codegen-agent.ts
│   │   ├── review-agent.ts
│   │   └── test-agent.ts
│   ├── demo/
│   │   └── run-demo.ts         # 一行命令跑完整流程
│   └── index.ts                # 导出所有公共类
├── index.html                  # 展示页面
├── package.json
└── tsconfig.json               # strict: true
```

---

## 当前指标

一次完整运行的数据：

| 项目 | 数据 |
|------|------|
| 耗时 | 79 秒（串行 5 次 API 调用） |
| 总产物 | 21,821 字符 |
| 需求分析 | 421 chars |
| 架构设计 | 1,200 chars |
| 代码生成 | 4,516 chars / 5 个 .ts 文件 |
| 代码审查 | 1,131 chars / 6 个问题点 |
| 测试生成 | 14,553 chars / 425 行 vitest |
| 编译 | TypeScript strict，零错误 |

换 API key：改 `src/core/llm-client.ts` 头部的三个常量。

---

## 如果 API 挂了

每个 Agent 带了 fallback。`base-agent.ts` 里 `execute()` 的 catch 块会走 `fallbackExecute()`，用内置的模板产出结果。你断网也能跑，产物照样生成。

---

## License

MIT
