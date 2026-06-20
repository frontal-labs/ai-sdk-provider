import { createAgentUIStreamResponse } from 'ai';
import { weatherAgent } from '@/agent/weather-agent';

export async function POST(request: Request) {
  const { messages } = await request.json();

  return createAgentUIStreamResponse({
    agent: weatherAgent,
    uiMessages: messages,
  });
}
