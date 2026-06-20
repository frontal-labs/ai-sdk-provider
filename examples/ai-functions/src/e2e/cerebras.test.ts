import 'dotenv/config';
import { type CerebrasErrorData, cerebras as provider } from '@ai-sdk/cerebras';
import type { APICallError } from '@ai-sdk/provider';
import { expect } from 'vitest';
import {
  createFeatureTestSuite,
  createLanguageModelWithCapabilities,
} from './feature-test-suite';

const createChatModel = (modelId: string) =>
  createLanguageModelWithCapabilities(provider.chat(modelId), [
    'objectGeneration',
    'textCompletion',
    'toolCalls',
  ]);

createFeatureTestSuite({
  name: 'Cerebras',
  models: {
    invalidModel: provider.chat('no-such-model'),
    languageModels: [
      createChatModel('llama3.1-8b'),
      createChatModel('llama3.1-70b'),
      createChatModel('llama-3.3-70b'),
    ],
  },
  timeout: 30_000,
  customAssertions: {
    errorValidator: (error: APICallError) => {
      expect((error.data as CerebrasErrorData).message).toMatch(/not exist/i);
    },
  },
})();
