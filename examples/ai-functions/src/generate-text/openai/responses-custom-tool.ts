import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { print } from '../../lib/print';
import { run } from '../../lib/run';

run(async () => {
  const result = await generateText({
    model: openai.responses('gpt-5.2-codex'),
    tools: {
      write_sql: openai.tools.customTool({
        description: 'Write a SQL SELECT query to answer the user question.',
        format: {
          type: 'grammar',
          syntax: 'regex',
          definition: 'SELECT .+',
        },
      }),
    },
    toolChoice: 'required',
    prompt: 'Write a SQL query to get all users older than 25.',
  });

  print('Tool calls:', result.toolCalls);
  print('Finish reason:', result.finishReason);
  print('Usage:', result.usage);
});
