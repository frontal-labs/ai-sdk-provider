import { createAgentUIStreamResponse } from 'ai';
import {
  type OpenAIMCPApprovalAgentUIMessage,
  openaiMCPApprovalAgent,
} from '@/agent/openai/mcp-approval-agent';

export const maxDuration = 60;

export type OpenAIResponsesMCPApprovalMessage = OpenAIMCPApprovalAgentUIMessage;

export async function POST(req: Request) {
  const body = await req.json();

  return createAgentUIStreamResponse({
    agent: openaiMCPApprovalAgent,
    uiMessages: body.messages,
  });
}
