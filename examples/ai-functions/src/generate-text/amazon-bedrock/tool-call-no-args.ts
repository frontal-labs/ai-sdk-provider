import { amazonBedrock } from '@ai-sdk/amazon-bedrock';
import { generateText, tool } from 'ai';
import { z } from 'zod';
import { print } from '../../lib/print';
import { run } from '../../lib/run';

run(async () => {
  const result = await generateText({
    model: amazonBedrock('anthropic.claude-3-5-sonnet-20241022-v2:0'),
    tools: {
      updateIssueList: tool({
        inputSchema: z.object({}), // empty input schema
      }),
    },
    prompt: 'Update the issue list',
  });

  print('Content:', result.content);
});
