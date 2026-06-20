import {
  type AnthropicLanguageModelOptions,
  anthropic,
} from '@ai-sdk/anthropic';
import { streamText } from 'ai';
import { print } from '../../lib/print';
import { printFullStream } from '../../lib/print-full-stream';
import { run } from '../../lib/run';

run(async () => {
  const result = streamText({
    model: anthropic('claude-sonnet-4-5'),
    prompt: `Call the echo tool with "hello world". what does it respond with back?`,
    providerOptions: {
      anthropic: {
        mcpServers: [
          {
            type: 'url',
            name: 'echo',
            url: 'https://echo.mcp.inevitable.fyi/mcp',
          },
        ],
      } satisfies AnthropicLanguageModelOptions,
    },
  });

  await printFullStream({ result });

  console.log();
  print('Request body:', (await result.request).body);
  print('Warnings:', await result.warnings);
});
