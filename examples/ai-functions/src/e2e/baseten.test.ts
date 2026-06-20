import 'dotenv/config';
import { baseten as provider } from '@ai-sdk/baseten';
import type { APICallError } from 'ai';
import { expect } from 'vitest';
import {
  createFeatureTestSuite,
  createLanguageModelWithCapabilities,
} from './feature-test-suite';

const createChatModel = (modelId: string) =>
  createLanguageModelWithCapabilities(provider.chatModel(modelId), [
    'textCompletion',
    'objectGeneration',
  ]);

createFeatureTestSuite({
  name: 'Baseten',
  models: {
    invalidModel: provider.chatModel('no-such-model'),
    languageModels: [createChatModel('deepseek-ai/DeepSeek-V3-0324')],
  },
  timeout: 60_000,
  customAssertions: {
    errorValidator: (error: APICallError) => {
      expect(error.message).toMatch(/model.*not found|invalid.*model|error/i);
    },
  },
})();
