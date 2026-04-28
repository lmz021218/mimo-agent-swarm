import { AgentConfig, AgentMessage, Artifact, ArtifactType } from './types.js';
import { chatCompletionStream, ChatMessage } from './llm-client.js';

/**
 * Agent基类 - 支持真实LLM调用的Agent抽象
 */
export abstract class BaseAgent {
  protected config: AgentConfig;

  constructor(config: AgentConfig) {
    this.config = config;
  }

  getId(): string { return this.config.id; }
  getName(): string { return this.config.name; }
  getRole(): string { return this.config.role; }

  /**
   * 接收消息并处理（兼容旧接口）
   */
  receiveMessage(message: AgentMessage): void {
    console.log(`[${this.getName()}] 收到消息: ${message.type} from ${message.from}`);
  }

  /**
   * 调用 LLM 执行专业任务
   */
  async execute(taskDescription: string, context: string = ''): Promise<Artifact> {
    console.log(`\n🤖 [${this.getName()}] 开始工作...`);

    const systemPrompt = this.buildSystemPrompt(taskDescription);
    const userPrompt = this.buildUserPrompt(taskDescription, context);

    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ];

    console.log(`   📤 发送请求 (${userPrompt.length} chars)`);

    try {
      process.stdout.write('   📝 ');
      let fullContent = '';

      for await (const chunk of chatCompletionStream(messages, { temperature: this.config.temperature })) {
        fullContent += chunk;
        process.stdout.write(chunk);
      }
      process.stdout.write('\n');

      console.log(`   ✅ [${this.getName()}] 完成 (${fullContent.length} chars)`);

      return {
        id: `${this.config.id}_${Date.now()}`,
        type: this.getArtifactType(),
        content: fullContent,
        author: this.getId(),
        version: 1,
        createdAt: Date.now(),
      };
    } catch (error) {
      console.error(`   ❌ [${this.getName()}] API 出错，使用 fallback:`, (error as Error).message);
      return this.fallbackExecute(taskDescription, context);
    }
  }

  protected abstract getArtifactType(): ArtifactType;
  protected abstract buildSystemPrompt(task: string): string;
  protected abstract buildUserPrompt(task: string, context: string): string;
  protected abstract fallbackExecute(task: string, context: string): Promise<Artifact>;

  toString(): string {
    return `${this.config.name} (${this.config.role})`;
  }
}
