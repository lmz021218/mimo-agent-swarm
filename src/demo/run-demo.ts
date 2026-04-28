import { AgentSwarmOrchestrator } from '../core/orchestrator.js';
import { RequirementAgent } from '../agents/requirement-agent.js';
import { ArchitectureAgent } from '../agents/architecture-agent.js';
import { CodeGenAgent } from '../agents/codegen-agent.js';
import { ReviewAgent } from '../agents/review-agent.js';
import { TestAgent } from '../agents/test-agent.js';
import { AgentConfig } from '../core/types.js';

function createConfig(id: string, name: string, role: string): AgentConfig {
  return {
    id,
    name,
    role,
    capabilities: [],
    systemPrompt: '',
    maxTokens: 4096,
    temperature: 0.3,
  };
}

async function main() {
  const task = process.argv[2] || '做一个命令行待办事项工具，支持添加、完成、列出任务';

  console.log('Mimo Agent Swarm — 多Agent协作开发');
  console.log(`目标：${task}\n`);

  const orch = new AgentSwarmOrchestrator();

  // 注册5个Agent
  orch.registerAgent(new RequirementAgent(
    createConfig('requirement-agent', '需求分析', '分析师')
  ));
  orch.registerAgent(new ArchitectureAgent(
    createConfig('architecture-agent', '架构设计', '架构师')
  ));
  orch.registerAgent(new CodeGenAgent(
    createConfig('codegen-agent', '代码生成', '工程师')
  ));
  orch.registerAgent(new ReviewAgent(
    createConfig('review-agent', '代码审查', '审查员')
  ));
  orch.registerAgent(new TestAgent(
    createConfig('test-agent', '测试生成', '测试')
  ));

  // 执行
  const result = await orch.executeTask(task);

  // 概览
  console.log('产物清单：');
  result.artifacts.forEach((a, i) => {
    console.log(`  ${i + 1}. [${a.type}] ${a.content.length} chars`);
  });
  console.log(`\n推理步骤：${result.reasoningChain.steps.length} 步`);
  console.log(`耗时：${result.metrics.executionTime}ms`);
  console.log('详细产物见 workspace/ 目录');
}

main().catch(console.error);
