import { createAgentUIStreamResponse } from 'ai';
import { openaiShellContainerSkillsAgent } from '@/agent/openai/shell-container-skills-agent';

export async function POST(req: Request) {
  const body = await req.json();

  return createAgentUIStreamResponse({
    agent: openaiShellContainerSkillsAgent,
    uiMessages: body.messages,
  });
}
