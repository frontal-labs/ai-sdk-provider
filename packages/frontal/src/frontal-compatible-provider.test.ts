import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FrontalChatLanguageModel } from './chat/frontal-compatible-chat-language-model';
import { FrontalCompletionLanguageModel } from './completion/frontal-compatible-completion-language-model';
import { FrontalEmbeddingModel } from './embedding/frontal-compatible-embedding-model';
import { FrontalImageModel } from './image/frontal-compatible-image-model';
import { createFrontal } from './frontal-compatible-provider';

// Mock version
vi.mock('./version', () => ({
  VERSION: '0.0.0-test',
}));

const FrontalChatLanguageModelMock = vi.mocked(
  FrontalChatLanguageModel,
);
const FrontalCompletionLanguageModelMock = vi.mocked(
  FrontalCompletionLanguageModel,
);
const FrontalEmbeddingModelMock = vi.mocked(
  FrontalEmbeddingModel,
);

const FrontalImageModelMock = vi.mocked(FrontalImageModel);

vi.mock('./chat/frontal-compatible-chat-language-model', () => ({
  FrontalChatLanguageModel: vi.fn(),
}));

vi.mock('./image/frontal-compatible-image-model', () => ({
  FrontalImageModel: vi.fn(),
}));

vi.mock('./completion/frontal-compatible-completion-language-model', () => ({
  FrontalCompletionLanguageModel: vi.fn(),
}));

vi.mock('./embedding/frontal-compatible-embedding-model', () => ({
  FrontalEmbeddingModel: vi.fn(),
}));

describe('FrontalProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createFrontal', () => {
    it('should create provider with correct configuration', () => {
      const options = {
        baseURL: 'https://api.example.com',
        name: 'test-provider',
        apiKey: 'test-api-key',
        headers: { 'custom-header': 'value' },
        queryParams: { 'Custom-Param': 'value' },
      };

      const provider = createFrontal(options);
      provider('model-id');

      const constructorCall =
        FrontalChatLanguageModelMock.mock.calls[0];
      const config = constructorCall[1];
      const headers = config.headers!();

      expect(headers).toEqual({
        authorization: 'Bearer test-api-key',
        'custom-header': 'value',
        'user-agent': 'ai-sdk/frontal-compatible/0.0.0-test',
      });
      expect(config.provider).toBe('test-provider.chat');
      expect(config.url({ modelId: 'model-id', path: '/v1/chat' })).toBe(
        'https://api.example.com/v1/chat?Custom-Param=value',
      );
    });

    it('should create headers without authorization when no apiKey provided', () => {
      const options = {
        baseURL: 'https://api.example.com',
        name: 'test-provider',
        headers: { 'custom-header': 'value' },
      };

      const provider = createFrontal(options);
      provider('model-id');

      const constructorCall =
        FrontalChatLanguageModelMock.mock.calls[0];
      const config = constructorCall[1];
      const headers = config.headers!();

      expect(headers).toEqual({
        'custom-header': 'value',
        'user-agent': 'ai-sdk/frontal-compatible/0.0.0-test',
      });
    });
  });

  describe('model creation methods', () => {
    const defaultOptions = {
      baseURL: 'https://api.example.com',
      name: 'test-provider',
      apiKey: 'test-api-key',
      headers: { 'custom-header': 'value' },
      queryParams: { 'Custom-Param': 'value' },
    };

    it('should create chat model with correct configuration', () => {
      const provider = createFrontal(defaultOptions);

      provider.chatModel('chat-model');

      const constructorCall =
        FrontalChatLanguageModelMock.mock.calls[0];
      const config = constructorCall[1];
      const headers = config.headers!();

      expect(headers).toEqual({
        authorization: 'Bearer test-api-key',
        'custom-header': 'value',
        'user-agent': 'ai-sdk/frontal-compatible/0.0.0-test',
      });
      expect(config.provider).toBe('test-provider.chat');
      expect(config.url({ modelId: 'model-id', path: '/v1/chat' })).toBe(
        'https://api.example.com/v1/chat?Custom-Param=value',
      );
    });

    it('should create completion model with correct configuration', () => {
      const provider = createFrontal(defaultOptions);

      provider.completionModel('completion-model');

      const constructorCall =
        FrontalCompletionLanguageModelMock.mock.calls[0];
      const config = constructorCall[1];
      const headers = config.headers!();

      expect(headers).toEqual({
        authorization: 'Bearer test-api-key',
        'custom-header': 'value',
        'user-agent': 'ai-sdk/frontal-compatible/0.0.0-test',
      });
      expect(config.provider).toBe('test-provider.completion');
      expect(
        config.url({ modelId: 'completion-model', path: '/v1/completions' }),
      ).toBe('https://api.example.com/v1/completions?Custom-Param=value');
    });

    it('should create embedding model with correct configuration', () => {
      const provider = createFrontal(defaultOptions);

      provider.embeddingModel('embedding-model');

      const constructorCall = FrontalEmbeddingModelMock.mock.calls[0];
      const config = constructorCall[1];
      const headers = config.headers!();

      expect(headers).toEqual({
        authorization: 'Bearer test-api-key',
        'custom-header': 'value',
        'user-agent': 'ai-sdk/frontal-compatible/0.0.0-test',
      });
      expect(config.provider).toBe('test-provider.embedding');
      expect(
        config.url({ modelId: 'embedding-model', path: '/v1/embeddings' }),
      ).toBe('https://api.example.com/v1/embeddings?Custom-Param=value');
    });

    it('should use languageModel as default when called as function', () => {
      const provider = createFrontal(defaultOptions);

      provider('model-id');

      expect(FrontalChatLanguageModel).toHaveBeenCalledWith(
        'model-id',
        expect.objectContaining({
          provider: 'test-provider.chat',
        }),
      );
    });

    it('should create URL without query parameters when queryParams is not specified', () => {
      const options = {
        baseURL: 'https://api.example.com',
        name: 'test-provider',
        apiKey: 'test-api-key',
      };

      const provider = createFrontal(options);
      provider('model-id');

      const constructorCall =
        FrontalChatLanguageModelMock.mock.calls[0];
      const config = constructorCall[1];

      expect(config.url({ modelId: 'model-id', path: '/v1/chat' })).toBe(
        'https://api.example.com/v1/chat',
      );
    });
  });

  describe('includeUsage setting', () => {
    it('should pass includeUsage: true to all model types when specified in provider settings', () => {
      const options = {
        baseURL: 'https://api.example.com',
        name: 'test-provider',
        includeUsage: true,
      };
      const provider = createFrontal(options);

      provider.chatModel('chat-model');
      expect(
        FrontalChatLanguageModelMock.mock.calls[0][1].includeUsage,
      ).toBe(true);

      provider.completionModel('completion-model');
      expect(
        FrontalCompletionLanguageModelMock.mock.calls[0][1]
          .includeUsage,
      ).toBe(true);

      provider('model-id');
      expect(
        FrontalChatLanguageModelMock.mock.calls[1][1].includeUsage,
      ).toBe(true);
    });

    it('should pass includeUsage: false to all model types when specified in provider settings', () => {
      const options = {
        baseURL: 'https://api.example.com',
        name: 'test-provider',
        includeUsage: false,
      };
      const provider = createFrontal(options);

      provider.chatModel('chat-model');
      expect(
        FrontalChatLanguageModelMock.mock.calls[0][1].includeUsage,
      ).toBe(false);

      provider.completionModel('completion-model');
      expect(
        FrontalCompletionLanguageModelMock.mock.calls[0][1]
          .includeUsage,
      ).toBe(false);

      provider('model-id');
      expect(
        FrontalChatLanguageModelMock.mock.calls[1][1].includeUsage,
      ).toBe(false);
    });

    it('should pass includeUsage: undefined to all model types when not specified in provider settings', () => {
      const options = {
        baseURL: 'https://api.example.com',
        name: 'test-provider',
      };
      const provider = createFrontal(options);

      provider.chatModel('chat-model');
      expect(
        FrontalChatLanguageModelMock.mock.calls[0][1].includeUsage,
      ).toBeUndefined();

      provider.completionModel('completion-model');
      expect(
        FrontalCompletionLanguageModelMock.mock.calls[0][1]
          .includeUsage,
      ).toBeUndefined();

      provider('model-id');
      expect(
        FrontalChatLanguageModelMock.mock.calls[1][1].includeUsage,
      ).toBeUndefined();
    });
  });

  describe('supportsStructuredOutputs setting', () => {
    it('should pass supportsStructuredOutputs to to .chatModel() and .languageModel() only', () => {
      const options = {
        baseURL: 'https://api.example.com',
        name: 'test-provider',
        supportsStructuredOutputs: true,
      };
      const provider = createFrontal(options);

      provider('model-id');
      expect(
        FrontalChatLanguageModelMock.mock.calls[0][1]
          .supportsStructuredOutputs,
      ).toBe(true);

      provider.chatModel('chat-model');
      expect(
        FrontalChatLanguageModelMock.mock.calls[1][1]
          .supportsStructuredOutputs,
      ).toBe(true);

      provider.languageModel('completion-model');
      expect(
        FrontalChatLanguageModelMock.mock.calls[2][1]
          .supportsStructuredOutputs,
      ).toBe(true);

      provider.completionModel('completion-model');
      const completionModelConfigArg =
        FrontalCompletionLanguageModelMock.mock.calls[0][1];
      expect(
        // @ts-expect-error - testing
        completionModelConfigArg.supportsStructuredOutputs,
      ).toBe(undefined);

      provider.embeddingModel('embedding-model');
      const embeddingModelConfigArg =
        FrontalEmbeddingModelMock.mock.calls[0][1];
      expect(
        // @ts-expect-error - testing
        embeddingModelConfigArg.supportsStructuredOutputs,
      ).toBe(undefined);

      provider.imageModel('image-model');
      const imageModelConfigArg =
        FrontalImageModelMock.mock.calls[0][1];
      expect(
        // @ts-expect-error - testing
        imageModelConfigArg.supportsStructuredOutputs,
      ).toBe(undefined);
    });
  });

  describe('metadataExtractor setting', () => {
    it('should pass metadataExtractor to chat model', () => {
      const mockExtractor = {
        extractMetadata: async () => undefined,
        createStreamExtractor: () => ({
          processChunk: () => {},
          buildMetadata: () => undefined,
        }),
      };

      const provider = createFrontal({
        baseURL: 'https://api.example.com',
        name: 'test-provider',
        metadataExtractor: mockExtractor,
      });

      provider.chatModel('chat-model');

      expect(
        FrontalChatLanguageModelMock.mock.calls[0][1]
          .metadataExtractor,
      ).toBe(mockExtractor);
    });
  });
});
