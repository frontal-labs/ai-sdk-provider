import { createAgentUIStreamResponse } from 'ai';
import { anthropicMcpAgent } from '@/agent/anthropic/mcp-agent';

export async function POST(request: Request) {
  const body = await request.json();

  console.dir(body.messages, { depth: Number.POSITIVE_INFINITY });

  return createAgentUIStreamResponse({
    agent: anthropicMcpAgent,
    uiMessages: body.messages,
  });
}
