import { openai } from '@ai-sdk/openai';
import { generateText, wrapLanguageModel } from 'ai';
import { run } from '../lib/run';
import { yourLogMiddleware } from './your-log-middleware';

run(async () => {
  const result = await generateText({
    model: wrapLanguageModel({
      model: openai('gpt-4o'),
      middleware: yourLogMiddleware,
    }),
    prompt: 'What cities are in the United States?',
  });
});
