import { createAgentUIStreamResponse } from 'ai';
import { openaiShellContainerAgent } from '@/agent/openai/shell-container-agent';

export async function POST(req: Request) {
  const body = await req.json();

  return createAgentUIStreamResponse({
    agent: openaiShellContainerAgent,
    uiMessages: body.messages,
  });
}
