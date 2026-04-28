import { BaseAgent } from '../core/base-agent.js';
import { AgentMessage, Artifact } from '../core/types.js';

/**
 * 代码审查Agent
 * 审查代码质量、安全性、性能，提供改进建议
 */
export class ReviewAgent extends BaseAgent {
  
  protected async handleMessage(message: AgentMessage): Promise<void> {
    console.log(`[${this.getName()}] 收到消息: ${message.type} from ${message.from}`);
    
    if (message.content.includes('代码') || message.content.includes('实现')) {
      const review = await this.reviewCode(message.content);
      console.log(`[${this.getName()}] 代码审查完成，报告长度: ${review.length}`);
    }
  }

  private async reviewCode(code: string): Promise<string> {
    const reasoning = await this.simulateReasoning(
      `审查代码: ${code.substring(0, 100)}...`,
      ['安全规范', '性能优化', '代码质量指标']
    );

    return `
## 代码审查报告

### 审查概览
- **审查范围**: 核心模块
- **代码行数**: ~500行
- **审查标准**: SOLID原则、TypeScript严格模式

### 发现问题

#### 🔴 严重 (Critical)
1. **类型安全**: 部分接口使用 <code>any</code>，建议替换为具体类型
2. **错误处理**: 缺少try-catch块，可能导致未捕获的异常

#### 🟡 警告 (Warning)
1. **性能优化**: 循环中存在重复计算，建议提取到循环外
2. **命名规范**: 部分变量命名不够清晰

#### 🟢 建议 (Suggestion)
1. **文档完善**: 为公开API添加JSDoc注释
2. **测试覆盖**: 建议增加边界条件测试

### 改进建议
${reasoning}

### 安全评估
- ✅ 无SQL注入风险
- ✅ 无XSS漏洞
- ⚠️ 建议加强输入验证
`;
  }

  async reviewImplementation(code: string): Promise<Artifact> {
    const review = await this.reviewCode(code);
    
    return {
      id: `review_${Date.now()}`,
      type: 'review',
      content: review,
      author: this.getId(),
      version: 1,
      createdAt: Date.now()
    };
  }
}
