export { FrontalChatLanguageModel } from './chat/frontal-compatible-chat-language-model';
export type {
  FrontalChatModelId,
  FrontalLanguageModelChatOptions,
  /** @deprecated Use `FrontalLanguageModelChatOptions` instead. */
  FrontalLanguageModelChatOptions as FrontalProviderOptions,
} from './chat/frontal-compatible-chat-language-model-options';
export type { MetadataExtractor } from './chat/frontal-compatible-metadata-extractor';
export { FrontalCompletionLanguageModel } from './completion/frontal-compatible-completion-language-model';
export type {
  FrontalCompletionModelId,
  FrontalLanguageModelCompletionOptions,
  /** @deprecated Use `FrontalLanguageModelCompletionOptions` instead. */
  FrontalLanguageModelCompletionOptions as FrontalCompletionProviderOptions,
} from './completion/frontal-compatible-completion-language-model-options';
export { FrontalEmbeddingModel } from './embedding/frontal-compatible-embedding-model';
export type {
  FrontalEmbeddingModelId,
  FrontalEmbeddingModelOptions,
  /** @deprecated Use `FrontalEmbeddingModelOptions` instead. */
  FrontalEmbeddingModelOptions as FrontalEmbeddingProviderOptions,
} from './embedding/frontal-compatible-embedding-model-options';
export { FrontalImageModel } from './image/frontal-compatible-image-model';
export type {
  FrontalErrorData,
  ProviderErrorStructure,
} from './frontal-compatible-error';
export type {
  FrontalProvider,
  FrontalProviderSettings,
} from './frontal-compatible-provider';
export { createFrontal } from './frontal-compatible-provider';
export { VERSION } from './version';
