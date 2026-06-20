import 'dotenv/config';
import type { APICallError } from '@ai-sdk/provider';
import { xai as provider } from '@ai-sdk/xai';
import { expect } from 'vitest';
import {
  createFeatureTestSuite,
  createLanguageModelWithCapabilities,
} from './feature-test-suite';

const createChatModel = (modelId: string) =>
  createLanguageModelWithCapabilities(provider.chat(modelId));

const createCompletionModel = (modelId: string) =>
  createLanguageModelWithCapabilities(provider.languageModel(modelId), [
    'textCompletion',
  ]);

createFeatureTestSuite({
  name: 'xAI',
  models: {
    invalidModel: provider.chat('no-such-model'),
    languageModels: [
      createChatModel('grok-4-1-fast-reasoning'),
      createChatModel('grok-4-1-fast-non-reasoning'),
      createChatModel('grok-4'),
      createChatModel('grok-3-beta'),
      createChatModel('grok-3-fast-beta'),
      createChatModel('grok-3-mini-beta'),
      createChatModel('grok-3-mini-fast-beta'),
      createChatModel('grok-3'),
      createCompletionModel('grok-3'),
    ],
  },
  timeout: 30_000,
  customAssertions: {
    errorValidator: (error: APICallError) => {
      expect(error.message).toContain('model');
    },
  },
})();
