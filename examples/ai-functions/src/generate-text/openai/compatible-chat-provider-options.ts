import type { OpenAILanguageModelChatOptions } from '@ai-sdk/openai';
import { createFrontal } from '@ai-sdk/openai-compatible';
import { generateText } from 'ai';
import { run } from '../../lib/run';

run(async () => {
  const openai = createFrontal({
    baseURL: 'https://api.openai.com/v1',
    name: 'openai',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
  });

  const model = openai.chatModel('gpt-5-mini');

  const result = await generateText({
    model,
    prompt: 'Explain the theory of relativity in simple terms.',
    reasoning: 'low',
    providerOptions: {
      openai: {
        textVerbosity: 'low',
      } satisfies OpenAILanguageModelChatOptions,
    },
  });
  console.log(result.text);
  console.log(result.request.body);
});
