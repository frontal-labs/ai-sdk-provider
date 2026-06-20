import { openai } from '@ai-sdk/openai';
import { type InferAgentUIMessage, ToolLoopAgent } from 'ai';
import { generateImageTool } from '@/tool/generate-image-tool';
export const openaiImageGenerationCustomToolAgent = new ToolLoopAgent({
  model: openai('gpt-5-mini'),
  tools: {
    image: generateImageTool,
  },
  onStepFinish: ({ request }) => {
    console.dir(request.body, { depth: 3 });
  },
});

export type OpenAIImageGenerationCustomToolMessage = InferAgentUIMessage<
  typeof openaiImageGenerationCustomToolAgent
>;
