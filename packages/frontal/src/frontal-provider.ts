import type {
  EmbeddingModelV4,
  ImageModelV4,
  LanguageModelV4,
  ProviderV4,
} from '@ai-sdk/provider';
import {
  type FetchFunction,
  withoutTrailingSlash,
  withUserAgentSuffix,
} from '@ai-sdk/provider-utils';
import {
  type FrontalChatConfig,
  FrontalChatLanguageModel,
} from './chat/frontal-chat-language-model';
import type { MetadataExtractor } from './chat/frontal-metadata-extractor';
import { FrontalCompletionLanguageModel } from './completion/frontal-completion-language-model';
import { FrontalEmbeddingModel } from './embedding/frontal-embedding-model';
import { FrontalImageModel } from './image/frontal-image-model';
import { VERSION } from './version';

export interface FrontalProvider<
  CHAT_MODEL_IDS extends string = string,
  COMPLETION_MODEL_IDS extends string = string,
  EMBEDDING_MODEL_IDS extends string = string,
  IMAGE_MODEL_IDS extends string = string,
> extends ProviderV4 {
  chatModel(modelId: CHAT_MODEL_IDS): LanguageModelV4;

  completionModel(modelId: COMPLETION_MODEL_IDS): LanguageModelV4;

  embeddingModel(modelId: EMBEDDING_MODEL_IDS): EmbeddingModelV4;

  imageModel(modelId: IMAGE_MODEL_IDS): ImageModelV4;

  languageModel(
    modelId: CHAT_MODEL_IDS,
    config?: Partial<FrontalChatConfig>,
  ): LanguageModelV4;

  /**
   * @deprecated Use `embeddingModel` instead.
   */
  textEmbeddingModel(modelId: EMBEDDING_MODEL_IDS): EmbeddingModelV4;
  (modelId: CHAT_MODEL_IDS): LanguageModelV4;
}

export interface FrontalProviderSettings {
  /**
   * API key for authenticating requests. If specified, adds an `Authorization`
   * header to request headers with the value `Bearer <apiKey>`. This will be added
   * before any headers potentially specified in the `headers` option.
   */
  apiKey?: string;
  /**
   * Base URL for the API calls.
   */
  baseURL: string;

  /**
   * Optional usage converter for providers with token accounting semantics that
   * differ from the default OpenAI-compatible shape.
   */
  convertUsage?: FrontalChatConfig['convertUsage'];

  /**
   * Custom fetch implementation. You can use it as a middleware to intercept requests,
   * or to provide a custom fetch implementation for e.g. testing.
   */
  fetch?: FetchFunction;

  /**
   * Optional custom headers to include in requests. These will be added to request headers
   * after any headers potentially added by use of the `apiKey` option.
   */
  headers?: Record<string, string>;

  /**
   * Include usage information in streaming responses.
   */
  includeUsage?: boolean;

  /**
   * Optional metadata extractor to capture provider-specific metadata from API responses.
   * This is useful for extracting non-standard fields, experimental features,
   * or provider-specific metrics from both streaming and non-streaming responses.
   */
  metadataExtractor?: MetadataExtractor;

  /**
   * Provider name.
   */
  name: string;

  /**
   * Optional custom url query parameters to include in request urls.
   */
  queryParams?: Record<string, string>;

  /**
   * The supported URLs for chat models.
   */
  supportedUrls?: FrontalChatConfig['supportedUrls'];

  /**
   * Whether the provider supports structured outputs in chat models.
   */
  supportsStructuredOutputs?: boolean;

  /**
   * Optional function to transform the request body before sending it to the API.
   * This is useful for proxy providers that may require a different request format
   * than the official OpenAI API.
   */
  transformRequestBody?: (args: Record<string, any>) => Record<string, any>;
}

/**
 * Create a Frontal provider instance.
 */
export function createFrontal<
  CHAT_MODEL_IDS extends string,
  COMPLETION_MODEL_IDS extends string,
  EMBEDDING_MODEL_IDS extends string,
  IMAGE_MODEL_IDS extends string,
>(
  options: FrontalProviderSettings,
): FrontalProvider<
  CHAT_MODEL_IDS,
  COMPLETION_MODEL_IDS,
  EMBEDDING_MODEL_IDS,
  IMAGE_MODEL_IDS
> {
  const baseURL = withoutTrailingSlash(options.baseURL);
  const providerName = options.name;

  interface CommonModelConfig {
    fetch?: FetchFunction;
    headers: () => Record<string, string>;
    provider: string;
    url: ({ path }: { path: string }) => string;
  }

  const headers = {
    ...(options.apiKey && { Authorization: `Bearer ${options.apiKey}` }),
    ...options.headers,
  };

  const getHeaders = () =>
    withUserAgentSuffix(headers, `ai-sdk/frontal/${VERSION}`);

  const getCommonModelConfig = (modelType: string): CommonModelConfig => ({
    provider: `${providerName}.${modelType}`,
    url: ({ path }) => {
      const url = new URL(`${baseURL}${path}`);
      if (options.queryParams) {
        url.search = new URLSearchParams(options.queryParams).toString();
      }
      return url.toString();
    },
    headers: getHeaders,
    fetch: options.fetch,
  });

  const createLanguageModel = (modelId: CHAT_MODEL_IDS) =>
    createChatModel(modelId);

  const createChatModel = (modelId: CHAT_MODEL_IDS) =>
    new FrontalChatLanguageModel(modelId, {
      ...getCommonModelConfig('chat'),
      includeUsage: options.includeUsage,
      supportsStructuredOutputs: options.supportsStructuredOutputs,
      supportedUrls: options.supportedUrls,
      transformRequestBody: options.transformRequestBody,
      metadataExtractor: options.metadataExtractor,
      convertUsage: options.convertUsage,
    });

  const createCompletionModel = (modelId: COMPLETION_MODEL_IDS) =>
    new FrontalCompletionLanguageModel(modelId, {
      ...getCommonModelConfig('completion'),
      includeUsage: options.includeUsage,
    });

  const createEmbeddingModel = (modelId: EMBEDDING_MODEL_IDS) =>
    new FrontalEmbeddingModel(modelId, {
      ...getCommonModelConfig('embedding'),
    });

  const createImageModel = (modelId: IMAGE_MODEL_IDS) =>
    new FrontalImageModel(modelId, getCommonModelConfig('image'));

  const provider = (modelId: CHAT_MODEL_IDS) => createLanguageModel(modelId);

  provider.specificationVersion = 'v4' as const;
  provider.languageModel = createLanguageModel;
  provider.chatModel = createChatModel;
  provider.completionModel = createCompletionModel;
  provider.embeddingModel = createEmbeddingModel;
  provider.textEmbeddingModel = createEmbeddingModel;
  provider.imageModel = createImageModel;

  return provider as FrontalProvider<
    CHAT_MODEL_IDS,
    COMPLETION_MODEL_IDS,
    EMBEDDING_MODEL_IDS,
    IMAGE_MODEL_IDS
  >;
}
