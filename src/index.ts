/**
 * Mimo Agent Swarm - 多Agent协作系统
 * 
 * 基于小米Mimo AI的多Agent协作框架，实现智能软件开发的自动化流程。
 * 包含需求分析、架构设计、代码生成、代码审查、测试生成等5个专业Agent，
 * 通过长链推理和多Agent协作完成复杂软件开发任务。
 */

export { BaseAgent } from './core/base-agent.js';
export { AgentSwarmOrchestrator } from './core/orchestrator.js';
export * from './core/types.js';

// Agent导出
export { RequirementAgent } from './agents/requirement-agent.js';
export { ArchitectureAgent } from './agents/architecture-agent.js';
export { CodeGenAgent } from './agents/codegen-agent.js';
export { ReviewAgent } from './agents/review-agent.js';
export { TestAgent } from './agents/test-agent.js';

console.log('🚀 Mimo Agent Swarm 已加载');
console.log('使用: import { AgentSwarmOrchestrator } from "mimo-agent-swarm"');
