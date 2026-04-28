import { BaseAgent } from '../core/base-agent.js';
import { Artifact } from '../core/types.js';

export class RequirementAgent extends BaseAgent {
  protected getArtifactType(): 'requirements' { return 'requirements'; }

  protected buildSystemPrompt(_task: string): string {
    return `你是需求分析师。把用户的一句话需求拆成清晰的功能点、约束条件和验收标准。

规则：
- 只输出结构化内容，不要寒暄
- 每个功能点一行，用"功能："开头
- 约束条件用"约束："开头
- 不要评价需求好坏，只做拆解
- 不要用"此外""进一步""值得注意的是"这类词`;
  }

  protected buildUserPrompt(task: string, context: string): string {
    if (context) {
      return `前面已完成的工作：\n${context}\n\n基于上面内容，分析："${task}"`;
    }
    return `分析需求："${task}"。列出功能点、约束条件和验收标准。`;
  }

  async fallbackExecute(task: string, _context: string): Promise<Artifact> {
    return {
      id: `req_fallback_${Date.now()}`,
      type: 'requirements',
      content: `需求分析（本地生成，API 未连接）

原始输入：${task}

功能点：
功能：用户输入自然语言需求，系统自动拆分任务
功能：任务按依赖关系分配到不同 Agent 执行
功能：每个 Agent 产出对应类型的文档或代码
功能：审查 Agent 检查代码质量并给出修改建议
功能：测试 Agent 生成对应的单元测试用例

约束：
约束：TypeScript 严格模式，不允许 any 类型
约束：ESLint 零警告
约束：每个模块需有 fallback 实现，确保离线可用

验收标准：
- 输入一句话需求，能生成 5 类产物
- 编译零错误
- 演示执行时间 < 5 秒`,
      author: this.getId(),
      version: 1,
      createdAt: Date.now(),
    };
  }
}
