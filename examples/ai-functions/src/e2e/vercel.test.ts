import 'dotenv/config';
import { vercel as provider } from '@ai-sdk/vercel';
import type { APICallError } from 'ai';
import { expect } from 'vitest';
import {
  createFeatureTestSuite,
  createLanguageModelWithCapabilities,
} from './feature-test-suite';

const createChatModel = (modelId: string) =>
  createLanguageModelWithCapabilities(provider(modelId), [
    'textCompletion',
    'objectGeneration',
  ]);

createFeatureTestSuite({
  name: 'Vercel',
  models: {
    invalidModel: provider('no-such-model'),
    languageModels: [createChatModel('v0-1.5-md')],
  },
  timeout: 30_000,
  customAssertions: {
    errorValidator: (error: APICallError) => {
      expect(error.message).toMatch(/model.*not found|invalid.*model/i);
    },
  },
})();
