import { createAgentUIStreamResponse } from 'ai';
import { anthropicToolSearchAgent } from '@/agent/anthropic/tool-search-agent';

export async function POST(request: Request) {
  const body = await request.json();

  return createAgentUIStreamResponse({
    agent: anthropicToolSearchAgent,
    uiMessages: body.messages,
  });
}
