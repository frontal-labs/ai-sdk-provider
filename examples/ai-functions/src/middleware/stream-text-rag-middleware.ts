import { openai } from '@ai-sdk/openai';
import { streamText, wrapLanguageModel } from 'ai';
import { run } from '../lib/run';
import { yourRagMiddleware } from './your-rag-middleware';

run(async () => {
  const result = streamText({
    model: wrapLanguageModel({
      model: openai('gpt-4o'),
      middleware: yourRagMiddleware,
    }),
    prompt: 'What cities are in the United States?',
  });

  for await (const textPart of result.textStream) {
    process.stdout.write(textPart);
  }
});
