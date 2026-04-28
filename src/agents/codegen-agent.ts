import { BaseAgent } from '../core/base-agent.js';
import { Artifact } from '../core/types.js';

export class CodeGenAgent extends BaseAgent {
  protected getArtifactType(): 'code' { return 'code'; }

  protected buildSystemPrompt(_task: string): string {
    return `你是 TypeScript 开发。根据架构设计写出可运行的代码。

规则：
- 用严格 TypeScript，所有类型显式声明
- 不要 any，不要 @ts-ignore
- 代码要能直接放到 .ts 文件里跑
- 不要写注释解释代码在做什么，除非有坑
- 类名、函数名要能一眼看出用途
- 不要写 package.json——只写业务代码`;
  }

  protected buildUserPrompt(task: string, context: string): string {
    if (context) {
      return `架构设计：\n${context}\n\n按照架构写出实现代码。只输出 TypeScript 代码文件，每个文件用 ### 文件名.ts 格式分隔。`;
    }
    return `为任务"${task}"写核心实现代码。不需要完整项目，只写最关键的 2-3 个文件。`;
  }

  async fallbackExecute(task: string, _context: string): Promise<Artifact> {
    return {
      id: `code_fallback_${Date.now()}`,
      type: 'code',
      content: `// 生成的代码（本地 fallback，API 未连接）
// 任务：${task}

### orchestrator.ts
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';

interface Task {
  id: string;
  description: string;
  status: 'pending' | 'running' | 'done';
  result?: string;
}

export class TaskOrchestrator {
  private tasks: Map<string, Task> = new Map();

  createTask(description: string): Task {
    const task: Task = {
      id: \`task_\${Date.now()}\`,
      description,
      status: 'pending',
    };
    this.tasks.set(task.id, task);
    return task;
  }

  async executeTask(taskId: string): Promise<Task> {
    const task = this.tasks.get(taskId);
    if (!task) throw new Error(\`Task \${taskId} not found\`);

    task.status = 'running';
    const outputDir = join(process.cwd(), 'workspace');
    await mkdir(outputDir, { recursive: true });
    await writeFile(join(outputDir, 'output.txt'), JSON.stringify(task, null, 2));

    task.status = 'done';
    return task;
  }

  getAllTasks(): Task[] {
    return Array.from(this.tasks.values());
  }
}

### index.ts
export { TaskOrchestrator } from './orchestrator.js';
export type { Task } from './orchestrator.js';

console.log('Task Orchestrator loaded');
`,
      author: this.getId(),
      version: 1,
      createdAt: Date.now(),
    };
  }
}
