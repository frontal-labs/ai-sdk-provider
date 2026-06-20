import {
  type AnthropicLanguageModelOptions,
  anthropic,
} from '@ai-sdk/anthropic';
import { generateText } from 'ai';
import { print } from '../../lib/print';
import { run } from '../../lib/run';

run(async () => {
  const result = await generateText({
    model: anthropic('claude-opus-4-6'),
    prompt: 'Summarize the key points of data residency.',
    providerOptions: {
      anthropic: {
        inferenceGeo: 'us',
      } satisfies AnthropicLanguageModelOptions,
    },
  });

  print('Content:', result.content);
  print('Usage:', result.usage);
  print('Finish reason:', result.finishReason);
});
