import { createAI } from '@ai-sdk/rsc';
import { generateId } from 'ai';
import { type AIState, submitUserMessage, type UIState } from './actions';

export const AI = createAI({
  actions: { submitUserMessage },
  initialUIState: [] as UIState,
  initialAIState: { chatId: generateId(), messages: [] } as AIState,
});
