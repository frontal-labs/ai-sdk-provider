import type { JSONValue } from '@ai-sdk/provider';

export type FrontalChatPrompt = Array<FrontalMessage>;

export type FrontalMessage =
  | FrontalSystemMessage
  | FrontalUserMessage
  | FrontalAssistantMessage
  | FrontalToolMessage;

// Allow for arbitrary additional properties for general purpose
// provider-metadata-specific extensibility.
type JsonRecord<T = never> = Record<
  string,
  JSONValue | JSONValue[] | T | T[] | undefined
>;

export interface FrontalSystemMessage extends JsonRecord {
  content: string;
  role: 'system';
}

export interface FrontalUserMessage
  extends JsonRecord<FrontalContentPart> {
  content: string | Array<FrontalContentPart>;
  role: 'user';
}

export type FrontalContentPart =
  | FrontalContentPartText
  | FrontalContentPartImage
  | FrontalContentPartInputAudio
  | FrontalContentPartFile;

export interface FrontalContentPartText extends JsonRecord {
  text: string;
  type: 'text';
}

export interface FrontalContentPartImage extends JsonRecord {
  image_url: { url: string };
  type: 'image_url';
}

// Audio parts for Google API
export interface FrontalContentPartInputAudio extends JsonRecord {
  input_audio: { data: string; format: 'wav' | 'mp3' };
  type: 'input_audio';
}

// File parts for Google API
export interface FrontalContentPartFile extends JsonRecord {
  file: { filename: string; file_data: string };
  type: 'file';
}

export interface FrontalAssistantMessage
  extends JsonRecord<FrontalMessageToolCall> {
  content?: string | null;
  reasoning_content?: string;
  role: 'assistant';
  tool_calls?: Array<FrontalMessageToolCall>;
}

export interface FrontalMessageToolCall extends JsonRecord {
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

export interface FrontalToolMessage extends JsonRecord {
  content: string;
  role: 'tool';
  tool_call_id: string;
}
