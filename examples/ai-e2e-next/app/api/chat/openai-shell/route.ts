import { createAgentUIStreamResponse } from 'ai';
import { openaiShellAgent } from '@/agent/openai/shell-agent';

export async function POST(req: Request) {
  const body = await req.json();

  return createAgentUIStreamResponse({
    agent: openaiShellAgent,
    uiMessages: body.messages,
  });
}
