'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, type FileUIPart } from 'ai';
import { useRef, useState } from 'react';
import type { AnthropicCodeExecutionFileUploadMessage } from '@/agent/anthropic/code-execution-file-upload-agent';
import { Response } from '@/components/ai-elements/response';
import ChatInput from '@/components/chat-input';
import AnthropicCodeExecutionView from '@/components/tool/anthropic-code-execution-view';

type UploadedFile = {
  filename: string;
  mediaType: string;
  providerReference: Record<string, string>;
  dataUrl: string;
};

async function uploadToAnthropic({
  base64,
  mediaType,
  filename,
}: {
  base64: string;
  mediaType: string;
  filename: string;
}): Promise<{ providerReference: Record<string, string> }> {
  const response = await fetch('/api/upload-file', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      data: base64,
      mediaType,
      filename,
      provider: 'anthropic',
    }),
  });

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.statusText}`);
  }

  const { providerReference } = await response.json();
  return { providerReference };
}

export default function AnthropicCodeExecutionFileUploadPage() {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [attachUploadedFile, setAttachUploadedFile] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { error, status, sendMessage, messages, regenerate } =
    useChat<AnthropicCodeExecutionFileUploadMessage>({
      transport: new DefaultChatTransport({
        api: '/api/chat/anthropic-code-execution-file-upload',
      }),
    });

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setIsUploading(true);
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const base64 = dataUrl.split(',')[1];
      const { providerReference } = await uploadToAnthropic({
        base64,
        mediaType: file.type || 'text/csv',
        filename: file.name,
      });

      setUploadedFile({
        filename: file.name,
        mediaType: file.type || 'text/csv',
        providerReference,
        dataUrl,
      });
      setAttachUploadedFile(true);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSend = (text: string) => {
    const files: FileUIPart[] =
      uploadedFile != null && attachUploadedFile
        ? [
            {
              type: 'file',
              url: uploadedFile.dataUrl,
              mediaType: uploadedFile.mediaType,
              filename: uploadedFile.filename,
              providerReference: uploadedFile.providerReference,
              providerMetadata: {
                anthropic: {
                  containerUpload: true,
                },
              },
            },
          ]
        : [];

    sendMessage({ text, files });
    setAttachUploadedFile(false);
  };

  return (
    <div className="stretch mx-auto flex w-full max-w-2xl flex-col py-24">
      <h1 className="mb-2 font-bold text-xl">
        Anthropic Code Execution File Upload
      </h1>
      <p className="mb-4 text-gray-600 text-sm">
        Upload a CSV, ask Claude to analyze it with code execution, then ask a
        follow-up question. The follow-up reuses the container ID returned by
        the previous assistant message.
      </p>

      <div className="mb-6 rounded border border-gray-200 p-3 text-sm">
        <input
          accept=".csv,text/csv"
          disabled={isUploading || status !== 'ready'}
          onChange={handleFileUpload}
          ref={fileInputRef}
          type="file"
        />
        {isUploading && <div className="mt-2 text-gray-500">Uploading...</div>}
        {uploadedFile && (
          <div className="mt-2">
            Uploaded:{' '}
            <span className="font-medium">{uploadedFile.filename}</span>
            {attachUploadedFile ? (
              <span className="ml-2 text-green-700">
                will attach to next message
              </span>
            ) : (
              <button
                className="ml-2 text-blue-600 underline"
                onClick={() => setAttachUploadedFile(true)}
                type="button"
              >
                attach again
              </button>
            )}
          </div>
        )}
      </div>

      {messages.map(message => {
        const containerId = (
          message.metadata as { containerId?: string } | undefined
        )?.containerId;

        return (
          <div className="mb-6 whitespace-pre-wrap" key={message.id}>
            <div className="mb-2 font-semibold text-sm">
              {message.role === 'user' ? 'User' : 'Assistant'}
              {containerId && (
                <span className="ml-2 rounded bg-gray-100 px-2 py-1 font-normal text-xs">
                  container: {containerId}
                </span>
              )}
            </div>

            {message.parts.map((part, index) => {
              switch (part.type) {
                case 'text':
                  return <Response key={index}>{part.text}</Response>;
                case 'file':
                  return (
                    <div
                      className="mb-2 inline-block rounded bg-gray-100 px-2 py-1 text-gray-700 text-xs"
                      key={index}
                    >
                      Attached file: {part.filename ?? 'file'}
                    </div>
                  );
                case 'tool-code_execution':
                  return (
                    <AnthropicCodeExecutionView invocation={part} key={index} />
                  );
              }
            })}
          </div>
        );
      })}

      {error && (
        <div className="mt-4">
          <div className="text-red-500">An error occurred.</div>
          <button
            className="mt-4 rounded-md border border-blue-500 px-4 py-2 text-blue-500"
            onClick={() => regenerate()}
            type="button"
          >
            Retry
          </button>
        </div>
      )}

      <ChatInput onSubmit={handleSend} status={status} />
    </div>
  );
}
