# Agent Swarm

五个 Agent 串成一条线。输入一句话，经过需求分析、架构设计、代码生成、审查、测试，产物写到 `workspace/`。

每个 Agent 调用 DeepSeek API。API 不可用时 fallback 到本地模板，不需要联网。

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 用法

独立 Agent 类。不是 OpenCode 插件，但可以复制到 skill 目录使用。

```typescript
import { AgentSwarmOrchestrator } from './src/core/orchestrator.js';
const orch = new AgentSwarmOrchestrator();
orch.registerAgent(new RequirementAgent(config));
const { artifacts } = await orch.executeTask('你的需求');
```

## 安装

```bash
git clone https://github.com/lmz021218/mimo-agent-swarm.git
cd mimo-agent-swarm
npm install

# 命令行
npx tsx src/cli.ts -t "做一个命令行 todo 工具"

# 从文件读取，合并保存
npx tsx src/cli.ts -f task.txt -o output --save merged.md --json
```

需要 Node.js 18+。

## 运行示例

```
Agent Swarm
目标：写一个 Node.js 命令行工具，统计目录下所有文件的行数

[需求分析] 开始...
  发送请求 (56 chars)
  功能：递归遍历、按行数排序、排除 node_modules
  完成 (421 chars)

[架构设计] 开始...
  发送请求 (472 chars)
  Node.js + fs/promises + path，cli.ts → counter.ts → fileFilter.ts
  完成 (1200 chars)

[代码生成] 开始...
  发送请求 (1717 chars)
  输出 5 个 TypeScript 文件
  完成 (4516 chars)

[代码审查] 开始...
  发送请求 (6228 chars)
  fileFilter.ts 异步处理 bug / 空文件统计逻辑 / 排序健壮性
  完成 (1131 chars)

[测试生成] 开始...
  发送请求 (7369 chars)
  425 行 vitest 用例
  完成 (14553 chars)

产物已保存到 workspace/
完成。耗时 79s，总产物 21,821 chars
```

## 文件

```
src/
  core/
    types.ts            # Artifact、AgentConfig
    base-agent.ts       # LLM 调用 + fallback
    llm-client.ts       # DeepSeek API
    orchestrator.ts     # 串行调度
  agents/
    requirement-agent.ts
    architecture-agent.ts
    codegen-agent.ts
    review-agent.ts
    test-agent.ts
  cli.ts                # 命令行入口
  demo/
    run-demo.ts
  index.ts
```

## 数据

一次完整运行（统计目录文件行数）：

| 项目 | 数值 |
|------|------|
| 耗时 | 79s |
| 总产物 | 21,821 chars |
| 代码文件 | 5 个 .ts |
| 审查问题 | 6 个 |
| 测试用例 | 425 行 vitest |

换 API key：改 `src/core/llm-client.ts` 头部的常量。

## License

MIT
