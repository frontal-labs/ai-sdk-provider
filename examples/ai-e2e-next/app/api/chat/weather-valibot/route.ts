import { createAgentUIStreamResponse } from 'ai';
import { weatherValibotAgent } from '@/agent/anthropic/weather-valibot-agent';

export async function POST(request: Request) {
  const { messages } = await request.json();

  console.dir(messages, { depth: Number.POSITIVE_INFINITY });

  return createAgentUIStreamResponse({
    agent: weatherValibotAgent,
    uiMessages: messages,
  });
}
