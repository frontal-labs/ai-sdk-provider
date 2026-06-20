import { streamText } from 'ai';
import { run } from '../lib/run';
import { registry } from './setup-registry';

run(async () => {
  const result = streamText({
    model: registry.languageModel('openai:gpt-5-mini'),
    prompt: 'Invent a new holiday and describe its traditions.',
  });

  for await (const textPart of result.textStream) {
    process.stdout.write(textPart);
  }
});
