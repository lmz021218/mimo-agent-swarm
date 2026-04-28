import { BaseAgent } from '../core/base-agent.js';
import { Artifact } from '../core/types.js';

export class TestAgent extends BaseAgent {
  protected getArtifactType(): 'tests' { return 'tests'; }

  protected buildSystemPrompt(_task: string): string {
    return `你是测试工程师。根据源码和审查报告写测试。

规则：
- 用 vitest 或 jest 风格
- 每个测试只测一件事
- 覆盖正常流程 + 边界条件 + 错误路径
- 不要 mock 掉核心逻辑
- 测试名用中文描述场景`;
  }

  protected buildUserPrompt(task: string, context: string): string {
    if (context) {
      // context 可能包含代码 + 审查报告
      return `源码和审查报告：\n${context}\n\n为这些代码写单元测试。每个模块一个 describe 块。`;
    }
    return `给任务"${task}"写测试用例。生成可直接运行的 vitest 测试文件。`;
  }

  async fallbackExecute(task: string, _context: string): Promise<Artifact> {
    return {
      id: `test_fallback_${Date.now()}`,
      type: 'tests',
      content: `// 测试用例（本地生成，API 未连接）
// 任务：${task}

import { describe, it, expect, beforeEach } from 'vitest';
import { TaskOrchestrator } from '../src/orchestrator';

describe('TaskOrchestrator', () => {
  let orch: TaskOrchestrator;

  beforeEach(() => {
    orch = new TaskOrchestrator();
  });

  describe('createTask', () => {
    it('创建任务并返回 pending 状态', () => {
      const task = orch.createTask('测试任务');
      expect(task.status).toBe('pending');
      expect(task.description).toBe('测试任务');
      expect(task.id).toMatch(/^task_/);
    });

    it('任务 id 唯一', () => {
      const t1 = orch.createTask('a');
      const t2 = orch.createTask('b');
      expect(t1.id).not.toBe(t2.id);
    });
  });

  describe('executeTask', () => {
    it('执行任务后状态变为 done', async () => {
      const task = orch.createTask('测试');
      const result = await orch.executeTask(task.id);
      expect(result.status).toBe('done');
    });

    it('不存在的任务抛异常', async () => {
      await expect(orch.executeTask('bad-id')).rejects.toThrow();
    });
  });

  describe('getAllTasks', () => {
    it('返回所有任务', () => {
      orch.createTask('a');
      orch.createTask('b');
      expect(orch.getAllTasks()).toHaveLength(2);
    });

    it('空列表返回空数组', () => {
      expect(orch.getAllTasks()).toEqual([]);
    });
  });
});
`,
      author: this.getId(),
      version: 1,
      createdAt: Date.now(),
    };
  }
}
