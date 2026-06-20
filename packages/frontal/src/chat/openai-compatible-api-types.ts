import type { JSONValue } from '@ai-sdk/provider';

export type OpenAICompatibleChatPrompt = Array<OpenAICompatibleMessage>;

export type OpenAICompatibleMessage =
  | OpenAICompatibleSystemMessage
  | OpenAICompatibleUserMessage
  | OpenAICompatibleAssistantMessage
  | OpenAICompatibleToolMessage;

// Allow for arbitrary additional properties for general purpose
// provider-metadata-specific extensibility.
type JsonRecord<T = never> = Record<
  string,
  JSONValue | JSONValue[] | T | T[] | undefined
>;

export interface OpenAICompatibleSystemMessage extends JsonRecord {
  content: string;
  role: 'system';
}

export interface OpenAICompatibleUserMessage
  extends JsonRecord<OpenAICompatibleContentPart> {
  content: string | Array<OpenAICompatibleContentPart>;
  role: 'user';
}

export type OpenAICompatibleContentPart =
  | OpenAICompatibleContentPartText
  | OpenAICompatibleContentPartImage
  | OpenAICompatibleContentPartInputAudio
  | OpenAICompatibleContentPartFile;

export interface OpenAICompatibleContentPartText extends JsonRecord {
  text: string;
  type: 'text';
}

export interface OpenAICompatibleContentPartImage extends JsonRecord {
  image_url: { url: string };
  type: 'image_url';
}

// Audio parts for Google API
export interface OpenAICompatibleContentPartInputAudio extends JsonRecord {
  input_audio: { data: string; format: 'wav' | 'mp3' };
  type: 'input_audio';
}

// File parts for Google API
export interface OpenAICompatibleContentPartFile extends JsonRecord {
  file: { filename: string; file_data: string };
  type: 'file';
}

export interface OpenAICompatibleAssistantMessage
  extends JsonRecord<OpenAICompatibleMessageToolCall> {
  content?: string | null;
  reasoning_content?: string;
  role: 'assistant';
  tool_calls?: Array<OpenAICompatibleMessageToolCall>;
}

export interface OpenAICompatibleMessageToolCall extends JsonRecord {
  /**
   * Additional content for provider-specific features.
   * Used by Google Gemini for thought signatures via OpenAI compatibility.
   */
  extra_content?: {
    google?: {
      thought_signature?: string;
    };
  };
  function: {
    arguments: string;
    name: string;
  };
  id: string;
  type: 'function';
}

export interface OpenAICompatibleToolMessage extends JsonRecord {
  content: string;
  role: 'tool';
  tool_call_id: string;
}
