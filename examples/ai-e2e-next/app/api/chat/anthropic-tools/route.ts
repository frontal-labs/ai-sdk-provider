import { createAgentUIStreamResponse } from 'ai';
import { anthropicToolsAgent } from '@/agent/anthropic/tools-agent';

export async function POST(request: Request) {
  const body = await request.json();

  return createAgentUIStreamResponse({
    agent: anthropicToolsAgent,
    uiMessages: body.messages,
  });
}
