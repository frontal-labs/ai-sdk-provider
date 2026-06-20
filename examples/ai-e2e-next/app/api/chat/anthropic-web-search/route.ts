import { createAgentUIStreamResponse } from 'ai';
import { anthropicWebSearchAgent } from '@/agent/anthropic/web-search-agent';

export async function POST(request: Request) {
  const body = await request.json();

  return createAgentUIStreamResponse({
    agent: anthropicWebSearchAgent,
    uiMessages: body.messages,
    sendSources: true,
  });
}
