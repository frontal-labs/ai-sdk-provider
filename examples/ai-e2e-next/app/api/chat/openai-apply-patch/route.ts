import { createAgentUIStreamResponse } from 'ai';
import { openaiApplyPatchAgent } from '@/agent/openai/apply-patch-agent';

export async function POST(req: Request) {
  const body = await req.json();

  return createAgentUIStreamResponse({
    agent: openaiApplyPatchAgent,
    uiMessages: body.messages,
  });
}
