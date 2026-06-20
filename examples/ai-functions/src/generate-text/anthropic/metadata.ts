import {
  type AnthropicLanguageModelOptions,
  anthropic,
} from '@ai-sdk/anthropic';
import { generateText } from 'ai';
import { print } from '../../lib/print';
import { run } from '../../lib/run';

run(async () => {
  const result = await generateText({
    model: anthropic('claude-sonnet-4-5'),
    prompt: 'Invent a new holiday and describe its traditions.',
    providerOptions: {
      anthropic: {
        metadata: { userId: 'user-123' },
      } satisfies AnthropicLanguageModelOptions,
    },
  });

  print('Content:', result.text);
});
