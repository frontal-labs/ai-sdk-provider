import {
  type OpenAILanguageModelResponsesOptions,
  openai,
} from '@ai-sdk/openai';
import { type InferAgentUIMessage, ToolLoopAgent } from 'ai';
export const openaiBasicAgent = new ToolLoopAgent({
  model: openai('gpt-5-mini'),
  reasoning: 'medium',
  providerOptions: {
    openai: {
      reasoningSummary: 'detailed',
      // store: false,
    } satisfies OpenAILanguageModelResponsesOptions,
  },
  onStepFinish: ({ request }) => {
    console.dir(request.body, { depth: Number.POSITIVE_INFINITY });
  },
});

export type OpenAIBasicMessage = InferAgentUIMessage<typeof openaiBasicAgent>;
