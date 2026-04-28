import { BaseAgent } from '../core/base-agent.js';
import { AgentMessage, Artifact } from '../core/types.js';

/**
 * 需求分析Agent
 * 负责理解用户需求，拆解任务，提取关键信息
 */
export class RequirementAgent extends BaseAgent {
  
  protected async handleMessage(message: AgentMessage): Promise<void> {
    console.log(`[${this.getName()}] 收到消息: ${message.type} from ${message.from}`);
    
    if (message.type === 'request') {
      const analysis = await this.analyzeRequirements(message.content);
      const response = this.createResponse(message.from, analysis);
      
      // 在真实场景中，这里会将消息发送给协调器
      console.log(`[${this.getName()}] 分析完成，响应长度: ${response.content.length}`);
    }
  }

  private async analyzeRequirements(content: string): Promise<string> {
    const reasoning = await this.simulateReasoning(
      `分析需求: ${content}`,
      ['历史需求模式', '领域知识库']
    );

    return `
## 需求分析报告

### 原始需求
${content}

### 核心功能点
1. 功能模块识别与拆分
2. 用户场景分析
3. 非功能性需求提取

### 技术约束
- 性能要求
- 安全要求
- 兼容性要求

### 分析结论
${reasoning}

### 建议下一步
移交架构设计Agent进行系统设计
`;
  }

  /**
   * 主动分析任务
   */
  async analyzeTask(taskDescription: string): Promise<Artifact> {
    const analysis = await this.analyzeRequirements(taskDescription);
    
    return {
      id: `req_${Date.now()}`,
      type: 'document',
      content: analysis,
      author: this.getId(),
      version: 1,
      createdAt: Date.now()
    };
  }
}
