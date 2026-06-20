import { anthropic } from '@ai-sdk/anthropic';
import { type InferAgentUIMessage, ToolLoopAgent } from 'ai';
import { weatherTool } from '@/tool/weather-tool';
export const anthropicToolsAgent = new ToolLoopAgent({
  model: anthropic('claude-haiku-4-5'),
  tools: {
    weather: weatherTool,
  },
});

export type AnthropicToolsAgentMessage = InferAgentUIMessage<
  typeof anthropicToolsAgent
>;
