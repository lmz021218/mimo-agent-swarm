import { BaseAgent } from '../core/base-agent.js';
import { Artifact } from '../core/types.js';

export class ArchitectureAgent extends BaseAgent {
  protected getArtifactType(): 'architecture' { return 'architecture'; }

  protected buildSystemPrompt(_task: string): string {
    return `你是系统架构师。根据需求分析结果，设计技术方案。

规则：
- 列出技术栈、模块划分、数据流
- 用具体的技术名词，不要"现代化""高性能"这类形容词
- 模块划分要有层级，但不要过度嵌套
- 不要画 ASCII 图，用文字描述结构即可
- 不要写"建议""推荐"这类软话，直接给出决定`;
  }

  protected buildUserPrompt(task: string, context: string): string {
    if (context) {
      return `需求如下：\n${context}\n\n为上述需求设计技术架构。包括：技术栈、模块划分、数据流。`;
    }
    return `为以下任务设计技术架构："${task}"。包括：技术栈、模块划分、数据流。`;
  }

  async fallbackExecute(task: string, _context: string): Promise<Artifact> {
    return {
      id: `arch_fallback_${Date.now()}`,
      type: 'architecture',
      content: `技术架构（本地生成，API 未连接）

任务：${task}

技术栈：
- 语言：TypeScript 5.3+，strict mode
- 运行时：Node.js 18+
- AI：通过 HTTP 调用 LLM API（OpenAI 兼容格式）

模块划分：
1. core/ — 基础设施层
   - llm-client.ts：封装 LLM API 调用，支持流式输出
   - base-agent.ts：Agent 抽象类，管理 LLM 调用和产物生成
   - types.ts：所有类型定义
   - orchestrator.ts：任务调度，串联多 Agent 协作

2. agents/ — Agent 实现层
   - requirement-agent.ts：需求 → 功能点 + 约束
   - architecture-agent.ts：需求 → 技术架构
   - codegen-agent.ts：架构 → TypeScript 代码
   - review-agent.ts：代码 → 审查意见
   - test-agent.ts：代码 + 审查 → 测试用例

数据流：
用户输入 → Orchestrator 串行调度 5 个 Agent
每个 Agent 的输出作为下一个 Agent 的上下文
最终输出 5 个文件到 workspace 目录`,
      author: this.getId(),
      version: 1,
      createdAt: Date.now(),
    };
  }
}
