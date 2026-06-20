import { createAgentUIStreamResponse } from 'ai';
import { openaiWeatherToolApprovalAgent } from '@/agent/openai/weather-tool-approval-agent';

export async function POST(req: Request) {
  const body = await req.json();

  return createAgentUIStreamResponse({
    agent: openaiWeatherToolApprovalAgent,
    uiMessages: body.messages,
  });
}
