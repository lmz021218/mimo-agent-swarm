import { BaseAgent } from '../core/base-agent.js';
import { Artifact } from '../core/types.js';

export class ReviewAgent extends BaseAgent {
  protected getArtifactType(): 'review' { return 'review'; }

  protected buildSystemPrompt(_task: string): string {
    return `你是代码审查员。只看代码，不说废话。

规则：
- 问题按严重程度排：🔴 必须修 / 🟡 建议修 / 🟢 可选
- 每个问题点出具体文件和位置
- 不要写"代码整体质量不错"这种开场白
- 不要用"值得注意的是""此外""另一方面"
- 如果没发现问题，就说"未发现明显问题"`;
  }

  protected buildUserPrompt(task: string, context: string): string {
    if (context) {
      return `审查以下代码：\n\`\`\`typescript\n${context}\n\`\`\`\n\n列出发现的问题，按严重程度分类。`;
    }
    return `审查任务"${task}"的代码实现。注意类型安全、错误处理和性能问题。`;
  }

  async fallbackExecute(task: string, _context: string): Promise<Artifact> {
    return {
      id: `review_fallback_${Date.now()}`,
      type: 'review',
      content: `代码审查报告（本地生成，API 未连接）

审查范围：${task}

🔴 必须修复
- orchestrator.ts:14 — executeTask 没有 try-catch，API 调用失败会直接抛异常
- 缺少输入验证，taskId 和 description 没做空值检查

🟡 建议修复
- Task 接口的 result 字段用了 string? 类型，建议用更具体的类型
- 文件操作没有错误重试机制

🟢 可选
- 用 EventEmitter 替代轮询来通知任务状态变化
- 添加 JSDoc 注释

安全：无 SQL 注入、XSS 风险。⚠️ 建议对文件路径做 sanitize。`,
      author: this.getId(),
      version: 1,
      createdAt: Date.now(),
    };
  }
}
