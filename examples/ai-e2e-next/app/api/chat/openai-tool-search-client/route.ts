import { createAgentUIStreamResponse } from 'ai';
import { openaiToolSearchClientAgent } from '@/agent/openai/tool-search-client-agent';

export async function POST(req: Request) {
  const body = await req.json();

  return createAgentUIStreamResponse({
    agent: openaiToolSearchClientAgent,
    uiMessages: body.messages,
  });
}
