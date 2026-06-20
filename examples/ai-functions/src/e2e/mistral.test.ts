import 'dotenv/config';
import { mistral as provider } from '@ai-sdk/mistral';
import type { APICallError } from 'ai';
import { expect } from 'vitest';
import {
  createEmbeddingModelWithCapabilities,
  createFeatureTestSuite,
  createLanguageModelWithCapabilities,
} from './feature-test-suite';

const createChatModel = (modelId: string) =>
  createLanguageModelWithCapabilities(provider.chat(modelId));

createFeatureTestSuite({
  name: 'Mistral',
  models: {
    invalidModel: provider.chat('no-such-model'),
    languageModels: [
      createChatModel('mistral-small-latest'),
      createChatModel('mistral-large-latest'),
    ],
    embeddingModels: [
      createEmbeddingModelWithCapabilities(
        provider.embeddingModel('mistral-embed'),
      ),
    ],
  },
  timeout: 30_000,
  customAssertions: {
    errorValidator: (error: APICallError) => {
      expect(error.message).toMatch(/model.*not found|invalid.*model/i);
    },
  },
})();
