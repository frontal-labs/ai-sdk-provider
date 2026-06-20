import { createAgentUIStreamResponse } from 'ai';
import { openaiToolSearchAgent } from '@/agent/openai/tool-search-agent';

export async function POST(req: Request) {
  const body = await req.json();

  return createAgentUIStreamResponse({
    agent: openaiToolSearchAgent,
    uiMessages: body.messages,
  });
}
