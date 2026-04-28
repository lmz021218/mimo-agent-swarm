import { AgentConfig, AgentMessage, TaskContext, AgentCapability } from './types.js';

/**
 * Agent基类 - 所有专业Agent的抽象基类
 * 实现消息接收、处理和发送的核心逻辑
 */
export abstract class BaseAgent {
  protected config: AgentConfig;
  protected messageQueue: AgentMessage[] = [];
  protected isProcessing: boolean = false;

  constructor(config: AgentConfig) {
    this.config = config;
  }

  getId(): string {
    return this.config.id;
  }

  getName(): string {
    return this.config.name;
  }

  getRole(): string {
    return this.config.role;
  }

  getCapabilities(): AgentCapability[] {
    return this.config.capabilities;
  }

  /**
   * 接收消息并加入队列
   */
  receiveMessage(message: AgentMessage): void {
    this.messageQueue.push(message);
    if (!this.isProcessing) {
      this.processQueue();
    }
  }

  /**
   * 处理消息队列
   */
  private async processQueue(): Promise<void> {
    this.isProcessing = true;
    
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift()!;
      await this.handleMessage(message);
    }
    
    this.isProcessing = false;
  }

  /**
   * 抽象方法：处理具体消息逻辑
   * 子类必须实现此方法来定义Agent的专业行为
   */
  protected abstract handleMessage(message: AgentMessage): Promise<void>;

  /**
   * 生成响应消息
   */
  protected createResponse(to: string, content: string, metadata?: Record<string, unknown>): AgentMessage {
    return {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      from: this.config.id,
      to,
      type: 'response',
      content,
      timestamp: Date.now(),
      metadata
    };
  }

  /**
   * 广播消息给所有Agent
   */
  protected createBroadcast(content: string, metadata?: Record<string, unknown>): AgentMessage {
    return {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      from: this.config.id,
      to: 'broadcast',
      type: 'broadcast',
      content,
      timestamp: Date.now(),
      metadata
    };
  }

  /**
   * 获取系统提示词
   */
  getSystemPrompt(): string {
    return this.config.systemPrompt;
  }

  /**
   * 模拟LLM推理过程（实际项目中会调用Mimo API）
   */
  protected async simulateReasoning(prompt: string, context: string[]): Promise<string> {
    // 这里在实际使用中会调用小米Mimo API
    // 当前为模拟实现，展示推理框架
    const reasoningSteps = [
      `分析输入: ${prompt.substring(0, 50)}...`,
      `结合上下文 (${context.length} 条历史记录)`,
      `应用 ${this.config.role} 的专业知识`,
      `生成响应...`
    ];
    
    // 模拟推理延迟
    await this.delay(100 + Math.random() * 200);
    
    return reasoningSteps.join('\n');
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  toString(): string {
    return `${this.config.name} (${this.config.role})`;
  }
}
