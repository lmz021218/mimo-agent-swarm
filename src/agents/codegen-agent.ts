import { BaseAgent } from '../core/base-agent.js';
import { AgentMessage, Artifact } from '../core/types.js';

/**
 * 代码生成Agent
 * 基于架构设计，生成高质量、可维护的代码
 */
export class CodeGenAgent extends BaseAgent {
  
  protected async handleMessage(message: AgentMessage): Promise<void> {
    console.log(`[${this.getName()}] 收到消息: ${message.type} from ${message.from}`);
    
    if (message.content.includes('架构') || message.content.includes('设计')) {
      const code = await this.generateCode(message.content);
      console.log(`[${this.getName()}] 代码生成完成`);
    }
  }

  private async generateCode(architecture: string): Promise<string> {
    const reasoning = await this.simulateReasoning(
      `生成代码: ${architecture.substring(0, 100)}...`,
      ['编码规范', '最佳实践', '类型安全']
    );

    return `
## 生成的代码

### 核心服务类
\`\`\`typescript
export class AgentOrchestrator {
  private agents: Map<string, BaseAgent> = new Map();
  private taskQueue: Task[] = [];
  
  async registerAgent(agent: BaseAgent): Promise<void> {
    this.agents.set(agent.getId(), agent);
    console.log(\`Agent \${agent.getName()} 已注册\`);
  }
  
  async executeTask(task: Task): Promise<Result> {
    const plan = await this.createExecutionPlan(task);
    return this.executePlan(plan);
  }
  
  private async createExecutionPlan(task: Task): Promise<ExecutionPlan> {
    // 智能任务分解与Agent分配
    const plan = new ExecutionPlan(task);
    
    for (const phase of task.phases) {
      const bestAgent = this.selectBestAgent(phase);
      plan.assign(phase, bestAgent);
    }
    
    return plan;
  }
}
\`\`\`

### 类型定义
\`\`\`typescript
interface Task {
  id: string;
  type: TaskType;
  priority: number;
  payload: unknown;
}

interface Result {
  success: boolean;
  data: unknown;
  metrics: ExecutionMetrics;
}
\`\`\`

### 生成说明
${reasoning}
`;
  }

  async generateImplementation(architecture: string): Promise<Artifact> {
    const code = await this.generateCode(architecture);
    
    return {
      id: `code_${Date.now()}`,
      type: 'code',
      content: code,
      author: this.getId(),
      version: 1,
      createdAt: Date.now()
    };
  }
}
