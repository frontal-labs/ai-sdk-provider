import { createAgentUIStreamResponse } from 'ai';
import { dynamicWeatherWithApprovalAgent } from '@/agent/anthropic/dynamic-weather-with-approval-agent';

export async function POST(request: Request) {
  const body = await request.json();

  console.dir(body.messages, { depth: Number.POSITIVE_INFINITY });

  return createAgentUIStreamResponse({
    agent: dynamicWeatherWithApprovalAgent,
    uiMessages: body.messages,
  });
}
