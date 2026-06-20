import { createAgentUIStreamResponse } from 'ai';
import { openaiLocalShellAgent } from '@/agent/openai/local-shell-agent';

export async function POST(req: Request) {
  const body = await req.json();

  return createAgentUIStreamResponse({
    agent: openaiLocalShellAgent,
    uiMessages: body.messages,
  });
}
