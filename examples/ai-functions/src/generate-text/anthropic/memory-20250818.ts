import { anthropic } from '@ai-sdk/anthropic';
import { generateText, isStepCount } from 'ai';
import { anthropicLocalFsMemoryTool } from '../../lib/anthropic-local-fs-memory-tool';
import { run } from '../../lib/run';

run(async () => {
  const result = await generateText({
    model: anthropic('claude-sonnet-4-5'),
    prompt: `Please remember these [MEM] facts for future turns.
Acknowledge by saying "stored".
[MEM] Name: Alex Rivera
[MEM] Role: PM at Nova Robotics`,
    tools: {
      memory: anthropicLocalFsMemoryTool({ basePath: './memory' }),
    },
    stopWhen: isStepCount(10),
  });

  console.dir(result.content, { depth: Number.POSITIVE_INFINITY });
});
