import { openai } from '@ai-sdk/openai';
import { generateText, isStepCount } from 'ai';
import { run } from '../../lib/run';
import { executeShellCommand } from '../../lib/shell-executor';

run(async () => {
  const result = await generateText({
    model: openai.responses('gpt-5.1'),
    tools: {
      shell: openai.tools.shell({
        execute: async ({ action }) => {
          const outputs = await Promise.all(
            action.commands.map(command =>
              executeShellCommand(command, action.timeoutMs),
            ),
          );

          return { output: outputs };
        },
      }),
    },
    prompt:
      'Create a file in my ~/Desktop directory called dec1.txt with the text: THIS WORKS!',
    stopWhen: isStepCount(5),
  });

  console.log('Result:', result.text);
});
