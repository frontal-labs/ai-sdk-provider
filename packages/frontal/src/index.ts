export { FrontalChatLanguageModel } from './chat/frontal-chat-language-model';
export type {
  FrontalChatModelId,
  FrontalLanguageModelChatOptions,
  /** @deprecated Use `FrontalLanguageModelChatOptions` instead. */
  FrontalLanguageModelChatOptions as FrontalProviderOptions,
} from './chat/frontal-chat-language-model-options';
export type { MetadataExtractor } from './chat/frontal-metadata-extractor';
export { FrontalCompletionLanguageModel } from './completion/frontal-completion-language-model';
export type {
  FrontalCompletionModelId,
  FrontalLanguageModelCompletionOptions,
  /** @deprecated Use `FrontalLanguageModelCompletionOptions` instead. */
  FrontalLanguageModelCompletionOptions as FrontalCompletionProviderOptions,
} from './completion/frontal-completion-language-model-options';
export { FrontalEmbeddingModel } from './embedding/frontal-embedding-model';
export type {
  FrontalEmbeddingModelId,
  FrontalEmbeddingModelOptions,
  /** @deprecated Use `FrontalEmbeddingModelOptions` instead. */
  FrontalEmbeddingModelOptions as FrontalEmbeddingProviderOptions,
} from './embedding/frontal-embedding-model-options';
export { FrontalImageModel } from './image/frontal-image-model';
export type {
  FrontalErrorData,
  ProviderErrorStructure,
} from './frontal-error';
export type {
  FrontalProvider,
  FrontalProviderSettings,
} from './frontal-provider';
export { createFrontal } from './frontal-provider';
export { VERSION } from './version';
