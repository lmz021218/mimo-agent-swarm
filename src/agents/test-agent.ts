import { BaseAgent } from '../core/base-agent.js';
import { AgentMessage, Artifact } from '../core/types.js';

/**
 * 测试生成Agent
 * 自动生成单元测试、集成测试，确保代码质量
 */
export class TestAgent extends BaseAgent {
  
  protected async handleMessage(message: AgentMessage): Promise<void> {
    console.log(`[${this.getName()}] 收到消息: ${message.type} from ${message.from}`);
    
    if (message.content.includes('代码') || message.content.includes('审查')) {
      const tests = await this.generateTests(message.content);
      console.log(`[${this.getName()}] 测试生成完成`);
    }
  }

  private async generateTests(code: string): Promise<string> {
    const reasoning = await this.simulateReasoning(
      `生成测试: ${code.substring(0, 100)}...`,
      ['测试策略', '边界条件', '覆盖率目标']
    );

    return `
## 测试用例

### 单元测试
\`\`\`typescript
import { describe, it, expect, vi } from 'vitest';
import { AgentOrchestrator } from '../src/core/orchestrator';

describe('AgentOrchestrator', () => {
  it('should register agent successfully', async () => {
    const orchestrator = new AgentOrchestrator();
    const mockAgent = createMockAgent('test-agent');
    
    await orchestrator.registerAgent(mockAgent);
    
    expect(orchestrator.getAgent('test-agent')).toBeDefined();
  });
  
  it('should execute task with multiple phases', async () => {
    const orchestrator = new AgentOrchestrator();
    const task = createComplexTask();
    
    const result = await orchestrator.executeTask(task);
    
    expect(result.success).toBe(true);
    expect(result.phasesCompleted).toBe(task.phases.length);
  });
  
  it('should handle agent failure gracefully', async () => {
    const orchestrator = new AgentOrchestrator();
    const failingAgent = createFailingAgent();
    
    await orchestrator.registerAgent(failingAgent);
    
    const result = await orchestrator.executeTask(createTask());
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });
});
\`\`\`

### 集成测试
\`\`\`typescript
describe('Multi-Agent Collaboration', () => {
  it('should complete full workflow end-to-end', async () => {
    const swarm = await createAgentSwarm();
    const task = '创建一个REST API服务';
    
    const result = await swarm.execute(task);
    
    expect(result.artifacts).toHaveLength(5); // 需求、设计、代码、审查、测试
    expect(result.metrics.completionRate).toBeGreaterThan(0.95);
  });
});
\`\`\`

### 测试策略
${reasoning}

### 覆盖率目标
- 行覆盖率: > 80%
- 分支覆盖率: > 70%
- 函数覆盖率: > 90%
`;
  }

  async createTestSuite(code: string): Promise<Artifact> {
    const tests = await this.generateTests(code);
    
    return {
      id: `test_${Date.now()}`,
      type: 'test',
      content: tests,
      author: this.getId(),
      version: 1,
      createdAt: Date.now()
    };
  }
}
