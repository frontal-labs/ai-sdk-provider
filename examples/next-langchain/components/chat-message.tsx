'use client';

import {
  isDataUIPart,
  isFileUIPart,
  isReasoningUIPart,
  isTextUIPart,
  isToolUIPart,
} from 'ai';
import type { CustomDataMessage } from '../app/types';
import { DataFileStatus, DataProgress, DataStatus } from './data-parts';
import { File, Reasoning, Text, ToolInvocation } from './message-parts';

interface ChatMessageProps {
  message: CustomDataMessage;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div
        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full font-medium text-sm ${
          isUser
            ? 'bg-gradient-to-br from-amber-500 to-orange-400 text-white'
            : 'bg-gradient-to-br from-amber-700 to-yellow-600 text-white'
        }`}
      >
        {isUser ? 'U' : 'AI'}
      </div>

      {/* Message content */}
      <div
        className={`max-w-[85%] flex-1 ${isUser ? 'flex flex-col items-end' : ''}`}
      >
        <div
          className={`flex flex-col gap-3 rounded-2xl px-4 py-3 ${
            isUser
              ? 'rounded-tr-md bg-[var(--accent)] text-white'
              : 'rounded-tl-md border border-[var(--border)] bg-[var(--background-tertiary)]'
          }`}
        >
          {message.parts.map((part, i) => {
            // Handle reasoning parts (extended thinking)
            if (isReasoningUIPart(part)) {
              return (
                <Reasoning
                  key={i}
                  state={part.state || 'done'}
                  text={part.text}
                />
              );
            }

            // Handle text parts
            if (isTextUIPart(part)) {
              return <Text key={i} text={part.text} />;
            }

            // Handle file parts (including generated images)
            if (isFileUIPart(part)) {
              return <File key={i} mediaType={part.mediaType} url={part.url} />;
            }

            // Handle tool parts
            if (isToolUIPart(part)) {
              const toolName =
                'toolName' in part
                  ? part.toolName
                  : part.type.replace('tool-', '');
              const input = 'input' in part ? part.input : undefined;
              const output = 'output' in part ? part.output : undefined;

              return (
                <ToolInvocation
                  input={input}
                  key={i}
                  output={output}
                  toolName={toolName}
                />
              );
            }
            // Handle custom data parts (data-progress, data-status, data-file-status, etc.)
            if (isDataUIPart(part)) {
              if (part.type === 'data-progress') {
                return (
                  <DataProgress
                    currentStep={part.data.currentStep}
                    key={i}
                    message={part.data.message}
                    progress={part.data.progress}
                    step={part.data.step}
                    totalSteps={part.data.totalSteps}
                  />
                );
              }

              if (part.type === 'data-status') {
                return (
                  <DataStatus
                    key={i}
                    message={part.data.message}
                    status={part.data.status}
                  />
                );
              }

              if (part.type === 'data-file-status') {
                return (
                  <DataFileStatus
                    filename={part.data.filename}
                    key={i}
                    operation={part.data.operation}
                    size={part.data.size}
                    status={part.data.status}
                  />
                );
              }

              return null;
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );
}
