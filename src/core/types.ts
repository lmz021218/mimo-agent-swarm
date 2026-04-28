/**
 * 核心类型定义 - 多Agent协作系统
 */

export interface AgentMessage {
  id: string;
  from: string;
  to: string;
  type: 'request' | 'response' | 'broadcast' | 'feedback';
  content: string;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

export interface TaskContext {
  taskId: string;
  description: string;
  requirements: string[];
  constraints: string[];
  currentPhase: TaskPhase;
  artifacts: Artifact[];
  history: AgentMessage[];
  startTime: number;
  estimatedTokens: number;
}

export type TaskPhase = 
  | 'analysis' 
  | 'design' 
  | 'implementation' 
  | 'review' 
  | 'refinement' 
  | 'completed';

export type ArtifactType = 'requirements' | 'architecture' | 'code' | 'document' | 'diagram' | 'test' | 'tests' | 'review';

export interface Artifact {
  id: string;
  type: ArtifactType;
  content: string;
  author: string;
  version: number;
  createdAt: number;
}

export interface AgentCapability {
  name: string;
  description: string;
  inputTypes: string[];
  outputTypes: string[];
}

export interface AgentConfig {
  id: string;
  name: string;
  role: string;
  capabilities: AgentCapability[];
  systemPrompt: string;
  maxTokens: number;
  temperature: number;
}

export interface ReasoningChain {
  id: string;
  steps: ReasoningStep[];
  currentStep: number;
  confidence: number;
}

export interface ReasoningStep {
  id: string;
  agentId: string;
  thought: string;
  action: string;
  observation: string;
  nextAction?: string;
  timestamp: number;
}

export interface ExecutionPlan {
  id: string;
  phases: ExecutionPhase[];
  dependencies: Map<string, string[]>;
}

export interface ExecutionPhase {
  id: string;
  name: string;
  agentIds: string[];
  inputs: string[];
  outputs: string[];
  status: 'pending' | 'running' | 'completed' | 'failed';
}

export interface SwarmMetrics {
  totalTokens: number;
  totalMessages: number;
  executionTime: number;
  agentUtilization: Map<string, number>;
  taskCompletionRate: number;
}
