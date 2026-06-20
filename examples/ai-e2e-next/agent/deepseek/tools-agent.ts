import { deepSeek } from '@ai-sdk/deepseek';
import { type InferAgentUIMessage, ToolLoopAgent } from 'ai';
import { weatherTool } from '@/tool/weather-tool';
export const deepseekToolsAgent = new ToolLoopAgent({
  model: deepSeek('deepseek-reasoner'),
  tools: { weather: weatherTool },
});

export type DeepSeekToolsAgentMessage = InferAgentUIMessage<
  typeof deepseekToolsAgent
>;
