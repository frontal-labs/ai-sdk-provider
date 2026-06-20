import 'dotenv/config';
import { type DeepSeekErrorData, deepSeek as provider } from '@ai-sdk/deepseek';
import type { APICallError } from 'ai';
import { expect } from 'vitest';
import {
  createFeatureTestSuite,
  createLanguageModelWithCapabilities,
} from './feature-test-suite';

const createChatModel = (modelId: string) =>
  createLanguageModelWithCapabilities(provider.chat(modelId));

createFeatureTestSuite({
  name: 'DeepSeek',
  models: {
    invalidModel: provider.chat('no-such-model'),
    languageModels: [createChatModel('deepseek-chat')],
  },
  timeout: 10_000,
  customAssertions: {
    errorValidator: (error: APICallError) => {
      expect(
        (error.data as DeepSeekErrorData).error.message === 'Model Not Exist',
      ).toBe(true);
    },
  },
})();
