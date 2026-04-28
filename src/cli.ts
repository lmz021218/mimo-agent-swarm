import { AgentSwarmOrchestrator } from './core/orchestrator.js';
import { RequirementAgent } from './agents/requirement-agent.js';
import { ArchitectureAgent } from './agents/architecture-agent.js';
import { CodeGenAgent } from './agents/codegen-agent.js';
import { ReviewAgent } from './agents/review-agent.js';
import { TestAgent } from './agents/test-agent.js';
import { AgentConfig, Artifact } from './core/types.js';
import { writeFile, mkdir, readFile } from 'node:fs/promises';

const HELP = `
用法: npx tsx src/cli.ts [选项]

选项:
  --task, -t <描述>     任务描述（必填）
  --out, -o <目录>      产物输出目录（默认 workspace）
  --save, -s <文件>      把最终产物合并保存到指定文件
  --from, -f <文件>      从文件读取任务描述
  --json                 以 JSON 格式输出结果摘要

示例:
  npx tsx src/cli.ts -t "做一个命令行 todo 工具"
  npx tsx src/cli.ts -t "写一个 Markdown 转 HTML 的 CLI" -o output --json
  npx tsx src/cli.ts -f task.txt -o output --save merged.md
`;

function createConfig(id: string, name: string, role: string): AgentConfig {
  return { id, name, role, capabilities: [], systemPrompt: '', maxTokens: 4096, temperature: 0.3 };
}

function parseArgs(argv: string[]) {
  const args: Record<string, string> = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--task' || a === '-t') args.task = argv[++i];
    else if (a === '--out' || a === '-o') args.out = argv[++i];
    else if (a === '--save' || a === '-s') args.save = argv[++i];
    else if (a === '--from' || a === '-f') args.from = argv[++i];
    else if (a === '--json') args.json = 'true';
    else if (a === '--help' || a === '-h') args.help = 'true';
    else if (!a.startsWith('-')) args.task = a;
  }
  return args;
}

async function mergeArtifacts(artifacts: Artifact[], outPath: string) {
  const parts = artifacts.map((a, i) => {
    const titles = ['需求分析', '架构设计', '代码实现', '代码审查', '测试用例'];
    return `\n# ${titles[i] || a.type}\n\n${a.content}\n`;
  });
  await writeFile(outPath, parts.join('\n---\n'), 'utf-8');
  console.log(`📄 合并产物已保存: ${outPath}`);
}

async function main() {
  const argv = parseArgs(process.argv.slice(2));

  if (argv.help || !argv.task) {
    console.log(HELP);
    process.exit(argv.help ? 0 : 1);
  }

  let task = argv.task;
  if (argv.from) {
    task = await readFile(argv.from, 'utf-8');
  }

  const outDir = argv.out || 'workspace';
  await mkdir(outDir, { recursive: true });

  console.log(`任务: ${task.trim().substring(0, 80)}${task.length > 80 ? '...' : ''}\n`);

  const orch = new AgentSwarmOrchestrator(outDir);

  orch.registerAgent(new RequirementAgent(createConfig('requirement-agent', '需求分析', '分析师')));
  orch.registerAgent(new ArchitectureAgent(createConfig('architecture-agent', '架构设计', '架构师')));
  orch.registerAgent(new CodeGenAgent(createConfig('codegen-agent', '代码生成', '工程师')));
  orch.registerAgent(new ReviewAgent(createConfig('review-agent', '代码审查', '审查员')));
  orch.registerAgent(new TestAgent(createConfig('test-agent', '测试生成', '测试')));

  const result = await orch.executeTask(task.trim());

  if (argv.json) {
    console.log(JSON.stringify({
      task: task.trim(),
      elapsed: result.metrics.executionTime,
      artifacts: result.artifacts.map(a => ({ type: a.type, chars: a.content.length })),
    }, null, 2));
    return;
  }

  console.log('产物:');
  result.artifacts.forEach((a, i) => {
    console.log(`  ${i + 1}. ${a.type} — ${a.content.length} chars`);
  });
  console.log(`\n耗时 ${(result.metrics.executionTime / 1000).toFixed(1)}s，文件在 ${outDir}/`);

  if (argv.save) {
    await mergeArtifacts(result.artifacts, argv.save);
  }
}

main().catch(err => {
  console.error('出错:', err.message);
  process.exit(1);
});
