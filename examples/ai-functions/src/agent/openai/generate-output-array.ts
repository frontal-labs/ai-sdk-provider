import {
  type OpenAILanguageModelResponsesOptions,
  openai,
} from '@ai-sdk/openai';
import { Output, ToolLoopAgent } from 'ai';
import { z } from 'zod';
import { print } from '../../lib/print';
import { run } from '../../lib/run';
import { weatherTool } from '../../tools/weather-tool';

const agent = new ToolLoopAgent({
  model: openai('gpt-5-mini'),
  providerOptions: {
    openai: {
      reasoningEffort: 'medium',
      strictJsonSchema: true,
    } satisfies OpenAILanguageModelResponsesOptions,
  },
  tools: { weather: weatherTool },
  output: Output.array({
    element: z.object({
      location: z.string(),
      temperature: z.number(),
      condition: z.string(),
    }),
  }),
});

run(async () => {
  const { output } = await agent.generate({
    prompt: 'What is the weather in San Francisco, London, Paris, and Berlin?',
  });

  print('Output:', output);
});
