import { BaseAgent } from './base-agent.js';
import {
  Artifact,
  ReasoningChain,
  SwarmMetrics,
} from './types.js';
import { writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';

export class AgentSwarmOrchestrator {
  private agents: Map<string, BaseAgent> = new Map();
  private metrics: SwarmMetrics = {
    totalTokens: 0,
    totalMessages: 0,
    executionTime: 0,
    agentUtilization: new Map(),
    taskCompletionRate: 0,
  };

  registerAgent(agent: BaseAgent): void {
    this.agents.set(agent.getId(), agent);
    this.metrics.agentUtilization.set(agent.getId(), 0);
  }

  listAgents(): BaseAgent[] {
    return Array.from(this.agents.values());
  }

  /**
   * 执行任务——按顺序调用5个Agent，前一个的输出作为后一个的上下文
   */
  async executeTask(description: string): Promise<{
    artifacts: Artifact[];
    metrics: SwarmMetrics;
    reasoningChain: ReasoningChain;
  }> {
    const startTime = Date.now();
    console.log(`\n╔══════════════════════════════════════╗`);
    console.log(`║  任务: ${description.substring(0, 30)}...`);
    console.log(`╚══════════════════════════════════════╝`);

    const agentOrder = [
      'requirement-agent',
      'architecture-agent',
      'codegen-agent',
      'review-agent',
      'test-agent',
    ];

    const artifacts: Artifact[] = [];
    const chain: ReasoningChain = {
      id: `chain_${Date.now()}`,
      steps: [],
      currentStep: 0,
      confidence: 1.0,
    };

    // 串行执行，每个 Agent 拿到前面所有产物
    for (const agentId of agentOrder) {
      const agent = this.agents.get(agentId);
      if (!agent) {
        console.warn(`Agent ${agentId} 未找到`);
        continue;
      }

      // 构建上下文（所有前面产物的聚合）
      const context = artifacts
        .map(a => `[${a.type}] ${a.content}`)
        .join('\n---\n');

      // 执行
      const artifact = await agent.execute(description, context);
      artifacts.push(artifact);

      // 记录推理步骤
      chain.steps.push({
        id: `step_${chain.steps.length}`,
        agentId,
        thought: `执行 ${agent.getName()} 阶段`,
        action: `输入上下文 ${context.length} chars`,
        observation: `输出 ${artifact.content.length} chars`,
        timestamp: Date.now(),
      });
      chain.currentStep = chain.steps.length;

      // 更新利用率
      const util = this.metrics.agentUtilization.get(agentId) || 0;
      this.metrics.agentUtilization.set(agentId, util + 1);
    }

    // 保存产物到文件
    await this.saveArtifacts(artifacts, description);

    const elapsed = Date.now() - startTime;
    this.metrics.executionTime += elapsed;

    console.log(`\n✅ 完成。耗时 ${elapsed}ms，产物 ${artifacts.length} 个\n`);

    return { artifacts, metrics: { ...this.metrics }, reasoningChain: chain };
  }

  private async saveArtifacts(artifacts: Artifact[], taskDescription: string): Promise<void> {
    const wsDir = join(process.cwd(), 'workspace');
    await mkdir(wsDir, { recursive: true });

    // 保存每个产物
    const extensions: Record<string, string> = {
      requirements: 'md',
      architecture: 'md',
      code: 'ts',
      review: 'md',
      tests: 'test.ts',
    };

    for (const a of artifacts) {
      const ext = extensions[a.type] || 'txt';
      await writeFile(join(wsDir, `${a.type}.${ext}`), a.content, 'utf-8');
    }

    // 生成汇总
    const summary = `任务：${taskDescription}\n时间：${new Date().toISOString()}\n产物：${artifacts.length} 个\n\n` +
      artifacts.map(a => `- ${a.type}: ${a.content.length} chars`).join('\n');

    await writeFile(join(wsDir, 'summary.md'), summary, 'utf-8');
    console.log(`📁 产物已保存到 workspace/`);
  }
}
