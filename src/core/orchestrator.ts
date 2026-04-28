import { BaseAgent } from './base-agent.js';
import { 
  TaskContext, 
  AgentMessage, 
  ExecutionPlan, 
  ExecutionPhase,
  ReasoningChain,
  ReasoningStep,
  Artifact,
  SwarmMetrics
} from './types.js';

/**
 * Agent Swarm 协调器
 * 负责任务分发、Agent调度、长链推理管理
 */
export class AgentSwarmOrchestrator {
  private agents: Map<string, BaseAgent> = new Map();
  private activeTasks: Map<string, TaskContext> = new Map();
  private reasoningChains: Map<string, ReasoningChain> = new Map();
  private metrics: SwarmMetrics = {
    totalTokens: 0,
    totalMessages: 0,
    executionTime: 0,
    agentUtilization: new Map(),
    taskCompletionRate: 0
  };

  /**
   * 注册Agent到Swarm
   */
  registerAgent(agent: BaseAgent): void {
    this.agents.set(agent.getId(), agent);
    this.metrics.agentUtilization.set(agent.getId(), 0);
    console.log(`✅ Agent 已注册: ${agent.toString()}`);
  }

  /**
   * 获取已注册的Agent
   */
  getAgent(id: string): BaseAgent | undefined {
    return this.agents.get(id);
  }

  /**
   * 列出所有Agent
   */
  listAgents(): BaseAgent[] {
    return Array.from(this.agents.values());
  }

  /**
   * 执行复杂任务 - 多Agent协作
   */
  async executeTask(description: string): Promise<{
    artifacts: Artifact[];
    metrics: SwarmMetrics;
    reasoningChain: ReasoningChain;
  }> {
    const taskId = `task_${Date.now()}`;
    const startTime = Date.now();

    console.log(`\n🚀 开始执行任务: ${description}`);
    console.log(`📋 任务ID: ${taskId}`);

    // 1. 创建任务上下文
    const taskContext = this.createTaskContext(taskId, description);
    this.activeTasks.set(taskId, taskContext);

    // 2. 初始化长链推理
    const reasoningChain = this.initializeReasoningChain(taskId);

    // 3. 创建执行计划
    const plan = await this.createExecutionPlan(taskContext);
    
    // 4. 按阶段执行
    const artifacts: Artifact[] = [];
    
    for (const phase of plan.phases) {
      console.log(`\n📌 执行阶段: ${phase.name}`);
      phase.status = 'running';
      
      const phaseArtifacts = await this.executePhase(phase, taskContext, reasoningChain);
      artifacts.push(...phaseArtifacts);
      
      phase.status = 'completed';
      
      // 更新任务上下文
      taskContext.artifacts.push(...phaseArtifacts);
    }

    // 5. 计算指标
    const executionTime = Date.now() - startTime;
    this.metrics.executionTime += executionTime;
    this.metrics.totalMessages += taskContext.history.length;
    
    // 6. 完成任务
    taskContext.currentPhase = 'completed';
    this.activeTasks.delete(taskId);

    console.log(`\n✅ 任务完成! 耗时: ${executionTime}ms`);
    console.log(`📊 生成产物: ${artifacts.length} 个`);

    return {
      artifacts,
      metrics: { ...this.metrics },
      reasoningChain
    };
  }

  /**
   * 创建任务上下文
   */
  private createTaskContext(taskId: string, description: string): TaskContext {
    return {
      taskId,
      description,
      requirements: [],
      constraints: [
        '代码必须类型安全',
        '遵循SOLID原则',
        '包含完整的错误处理'
      ],
      currentPhase: 'analysis',
      artifacts: [],
      history: [],
      startTime: Date.now(),
      estimatedTokens: 10000
    };
  }

  /**
   * 初始化长链推理链
   */
  private initializeReasoningChain(taskId: string): ReasoningChain {
    const chain: ReasoningChain = {
      id: `chain_${taskId}`,
      steps: [],
      currentStep: 0,
      confidence: 1.0
    };
    
    this.reasoningChains.set(chain.id, chain);
    return chain;
  }

  /**
   * 添加推理步骤
   */
  private addReasoningStep(
    chain: ReasoningChain, 
    agentId: string, 
    thought: string, 
    action: string,
    observation: string
  ): void {
    const step: ReasoningStep = {
      id: `step_${chain.steps.length}`,
      agentId,
      thought,
      action,
      observation,
      nextAction: undefined,
      timestamp: Date.now()
    };
    
    if (chain.steps.length > 0) {
      chain.steps[chain.steps.length - 1].nextAction = action;
    }
    
    chain.steps.push(step);
    chain.currentStep = chain.steps.length;
  }

  /**
   * 创建执行计划 - 智能任务分解
   */
  private async createExecutionPlan(taskContext: TaskContext): Promise<ExecutionPlan> {
    console.log('\n📝 创建执行计划...');

    const phases: ExecutionPhase[] = [
      {
        id: 'phase_1',
        name: '需求分析',
        agentIds: ['requirement-agent'],
        inputs: [taskContext.description],
        outputs: ['需求文档'],
        status: 'pending'
      },
      {
        id: 'phase_2',
        name: '架构设计',
        agentIds: ['architecture-agent'],
        inputs: ['需求文档'],
        outputs: ['架构设计文档'],
        status: 'pending'
      },
      {
        id: 'phase_3',
        name: '代码实现',
        agentIds: ['codegen-agent'],
        inputs: ['架构设计文档'],
        outputs: ['源代码'],
        status: 'pending'
      },
      {
        id: 'phase_4',
        name: '代码审查',
        agentIds: ['review-agent'],
        inputs: ['源代码'],
        outputs: ['审查报告'],
        status: 'pending'
      },
      {
        id: 'phase_5',
        name: '测试生成',
        agentIds: ['test-agent'],
        inputs: ['源代码', '审查报告'],
        outputs: ['测试用例'],
        status: 'pending'
      }
    ];

    // 添加推理步骤
    const chain = this.reasoningChains.get(`chain_${taskContext.taskId}`)!;
    this.addReasoningStep(
      chain,
      'orchestrator',
      '分析任务复杂度，确定需要5个执行阶段',
      '创建5阶段执行计划',
      '计划已创建，包含需求分析到测试生成的完整流程'
    );

    return {
      id: `plan_${taskContext.taskId}`,
      phases,
      dependencies: new Map([
        ['phase_2', ['phase_1']],
        ['phase_3', ['phase_2']],
        ['phase_4', ['phase_3']],
        ['phase_5', ['phase_3', 'phase_4']]
      ])
    };
  }

  /**
   * 执行单个阶段
   */
  private async executePhase(
    phase: ExecutionPhase, 
    taskContext: TaskContext,
    reasoningChain: ReasoningChain
  ): Promise<Artifact[]> {
    const artifacts: Artifact[] = [];
    
    for (const agentId of phase.agentIds) {
      const agent = this.agents.get(agentId);
      if (!agent) {
        console.warn(`⚠️ Agent ${agentId} 未找到`);
        continue;
      }

      // 更新利用率指标
      const currentUtil = this.metrics.agentUtilization.get(agentId) || 0;
      this.metrics.agentUtilization.set(agentId, currentUtil + 1);

      // 构建上下文消息
      const contextContent = this.buildPhaseContext(phase, taskContext);
      
      const message: AgentMessage = {
        id: `msg_${Date.now()}`,
        from: 'orchestrator',
        to: agentId,
        type: 'request',
        content: contextContent,
        timestamp: Date.now(),
        metadata: { phase: phase.name, taskId: taskContext.taskId }
      };

      // 发送消息给Agent
      agent.receiveMessage(message);
      taskContext.history.push(message);

      // 添加推理步骤
      this.addReasoningStep(
        reasoningChain,
        agentId,
        `准备执行${phase.name}阶段`,
        `调用${agent.getName()}处理任务`,
        `${agent.getName()}已接收任务，开始处理`
      );

      // 模拟Agent处理并获取结果
      // 实际项目中，Agent会异步返回结果
      await this.delay(500);

      // 创建模拟产物（实际项目中由Agent返回）
      const mockArtifact = await this.createMockArtifact(agent, phase, taskContext);
      if (mockArtifact) {
        artifacts.push(mockArtifact);
      }

      // 更新Token消耗估算
      this.metrics.totalTokens += 2000;
    }

    return artifacts;
  }

  /**
   * 构建阶段上下文
   */
  private buildPhaseContext(phase: ExecutionPhase, taskContext: TaskContext): string {
    const relevantArtifacts = taskContext.artifacts.filter(a => 
      phase.inputs.some(input => a.type.includes(input) || a.content.includes(input))
    );

    let context = `任务: ${taskContext.description}\n\n`;
    context += `阶段: ${phase.name}\n\n`;
    
    if (relevantArtifacts.length > 0) {
      context += `前置产物:\n${relevantArtifacts.map(a => `- ${a.type}: ${a.id}`).join('\n')}\n\n`;
    }

    return context;
  }

  /**
   * 创建模拟产物（用于演示）
   */
  private async createMockArtifact(
    agent: BaseAgent, 
    phase: ExecutionPhase,
    taskContext: TaskContext
  ): Promise<Artifact | null> {
    // 根据Agent类型生成对应的产物
    switch (agent.getId()) {
      case 'requirement-agent':
        return {
          id: `req_${Date.now()}`,
          type: 'document',
          content: `# 需求分析文档\n\n任务: ${taskContext.description}\n\n## 核心需求\n1. 功能需求A\n2. 功能需求B\n3. 性能需求\n\n## 分析结论\n需求明确，可进入设计阶段`,
          author: agent.getId(),
          version: 1,
          createdAt: Date.now()
        };
      
      case 'architecture-agent':
        return {
          id: `arch_${Date.now()}`,
          type: 'diagram',
          content: `# 架构设计\n\n## 技术栈\n- 前端: React + TypeScript\n- 后端: Node.js\n- 数据库: PostgreSQL\n\n## 模块划分\n1. 用户模块\n2. 业务模块\n3. AI模块`,
          author: agent.getId(),
          version: 1,
          createdAt: Date.now()
        };

      case 'codegen-agent':
        return {
          id: `code_${Date.now()}`,
          type: 'code',
          content: `// 生成的代码示例\nexport class Service {\n  async process(): Promise<Result> {\n    // 业务逻辑\n  }\n}`,
          author: agent.getId(),
          version: 1,
          createdAt: Date.now()
        };

      case 'review-agent':
        return {
          id: `review_${Date.now()}`,
          type: 'review',
          content: `# 代码审查报告\n\n## 评分: 85/100\n\n### 优点\n- 类型安全\n- 结构清晰\n\n### 改进点\n- 增加错误处理\n- 优化性能`,
          author: agent.getId(),
          version: 1,
          createdAt: Date.now()
        };

      case 'test-agent':
        return {
          id: `test_${Date.now()}`,
          type: 'test',
          content: `describe('Service', () => {\n  it('should process correctly', async () => {\n    // 测试逻辑\n  });\n});`,
          author: agent.getId(),
          version: 1,
          createdAt: Date.now()
        };

      default:
        return null;
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 获取系统状态
   */
  getStatus(): {
    agents: number;
    activeTasks: number;
    totalTokens: number;
  } {
    return {
      agents: this.agents.size,
      activeTasks: this.activeTasks.size,
      totalTokens: this.metrics.totalTokens
    };
  }
}
