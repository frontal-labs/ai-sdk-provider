import { createAgentUIStreamResponse } from 'ai';
import { anthropicWebFetchAgent } from '@/agent/anthropic/web-fetch-agent';

export async function POST(request: Request) {
  const body = await request.json();

  return createAgentUIStreamResponse({
    agent: anthropicWebFetchAgent,
    uiMessages: body.messages,
    sendSources: true,
  });
}
