/**
 * 演示脚本 - 展示多Agent协作系统的完整工作流
 * 
 * 运行: npm run demo
 */

import { AgentSwarmOrchestrator } from '../core/orchestrator.js';
import { RequirementAgent } from '../agents/requirement-agent.js';
import { ArchitectureAgent } from '../agents/architecture-agent.js';
import { CodeGenAgent } from '../agents/codegen-agent.js';
import { ReviewAgent } from '../agents/review-agent.js';
import { TestAgent } from '../agents/test-agent.js';

async function runDemo() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║     🤖 Mimo Agent Swarm - 多Agent协作演示                 ║');
  console.log('║     小米Mimo百万亿Tokens计划 - 智能软件开发系统            ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  // 1. 创建协调器
  const orchestrator = new AgentSwarmOrchestrator();

  // 2. 注册5个专业Agent
  console.log('📋 步骤1: 注册专业Agent团队\n');
  
  orchestrator.registerAgent(new RequirementAgent({
    id: 'requirement-agent',
    name: '需求分析Agent',
    role: '需求分析师',
    capabilities: [{
      name: '需求解析',
      description: '解析用户自然语言需求，提取功能点和约束条件',
      inputTypes: ['text'],
      outputTypes: ['requirement-document']
    }],
    systemPrompt: '你是一名资深需求分析师，擅长从模糊的需求描述中提取清晰的功能点和非功能需求。',
    maxTokens: 4000,
    temperature: 0.3
  }));

  orchestrator.registerAgent(new ArchitectureAgent({
    id: 'architecture-agent',
    name: '架构设计Agent',
    role: '架构师',
    capabilities: [{
      name: '系统设计',
      description: '设计可扩展、高可用的系统架构',
      inputTypes: ['requirement-document'],
      outputTypes: ['architecture-diagram', 'tech-spec']
    }],
    systemPrompt: '你是一名系统架构师，精通微服务架构、事件驱动架构和云原生设计模式。',
    maxTokens: 4000,
    temperature: 0.2
  }));

  orchestrator.registerAgent(new CodeGenAgent({
    id: 'codegen-agent',
    name: '代码生成Agent',
    role: '高级开发工程师',
    capabilities: [{
      name: '代码生成',
      description: '生成类型安全、可维护的高质量代码',
      inputTypes: ['tech-spec', 'architecture-diagram'],
      outputTypes: ['source-code']
    }],
    systemPrompt: '你是一名全栈开发工程师，擅长TypeScript、Node.js和React，注重代码质量和类型安全。',
    maxTokens: 8000,
    temperature: 0.1
  }));

  orchestrator.registerAgent(new ReviewAgent({
    id: 'review-agent',
    name: '代码审查Agent',
    role: '技术负责人',
    capabilities: [{
      name: '代码审查',
      description: '审查代码质量、安全性和性能',
      inputTypes: ['source-code'],
      outputTypes: ['review-report']
    }],
    systemPrompt: '你是一名技术负责人，严格把控代码质量，关注安全漏洞和性能瓶颈。',
    maxTokens: 4000,
    temperature: 0.2
  }));

  orchestrator.registerAgent(new TestAgent({
    id: 'test-agent',
    name: '测试生成Agent',
    role: 'QA工程师',
    capabilities: [{
      name: '测试生成',
      description: '生成单元测试、集成测试和端到端测试',
      inputTypes: ['source-code', 'review-report'],
      outputTypes: ['test-suite']
    }],
    systemPrompt: '你是一名QA工程师，精通测试驱动开发，擅长设计边界条件和异常场景的测试用例。',
    maxTokens: 4000,
    temperature: 0.2
  }));

  // 3. 显示系统状态
  console.log('\n📊 系统状态:', orchestrator.getStatus());

  // 4. 执行示例任务
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🎯 示例任务: 创建一个支持多Agent协作的任务管理系统');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const result = await orchestrator.executeTask(
    '创建一个支持多Agent协作的任务管理系统，包含任务分配、进度跟踪、结果汇总功能'
  );

  // 5. 展示结果
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📦 执行结果');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  console.log('\n📄 生成的产物:');
  result.artifacts.forEach((artifact, index) => {
    console.log(`  ${index + 1}. [${artifact.type}] ${artifact.id} (by ${artifact.author})`);
  });

  console.log('\n📈 性能指标:');
  console.log(`  • 总Token消耗: ${result.metrics.totalTokens.toLocaleString()}`);
  console.log(`  • 总消息数: ${result.metrics.totalMessages}`);
  console.log(`  • 执行时间: ${result.metrics.executionTime}ms`);
  console.log(`  • Agent利用率:`);
  result.metrics.agentUtilization.forEach((count, agentId) => {
    console.log(`    - ${agentId}: ${count} 次调用`);
  });

  console.log('\n🔗 长链推理:');
  console.log(`  • 推理链ID: ${result.reasoningChain.id}`);
  console.log(`  • 推理步骤: ${result.reasoningChain.steps.length} 步`);
  console.log(`  • 当前步骤: ${result.reasoningChain.currentStep}`);
  console.log(`  • 置信度: ${(result.reasoningChain.confidence * 100).toFixed(1)}%`);

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ 演示完成！');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

// 运行演示
runDemo().catch(console.error);
