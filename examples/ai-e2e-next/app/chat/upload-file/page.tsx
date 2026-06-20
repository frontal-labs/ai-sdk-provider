'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, type FileUIPart, generateId } from 'ai';
import { useRef, useState } from 'react';
import ChatInput from '@/components/chat-input';

const MODELS = [
  {
    id: 'claude-sonnet-4-6',
    provider: 'anthropic',
    label: 'Claude Sonnet 4.6 (Anthropic)',
  },
  {
    id: 'gemini-3.1-pro-preview',
    provider: 'google',
    label: 'Gemini 3.1 Pro Preview (Google)',
  },
  { id: 'gpt-5.4', provider: 'openai', label: 'GPT-5.4 (OpenAI)' },
  {
    id: 'grok-4.20-0309-reasoning',
    provider: 'xai',
    label: 'Grok 4.20 Reasoning (xAI)',
  },
] as const;

type UploadedFile = {
  id: string;
  filename: string;
  mediaType: string;
  providerReference: Record<string, string>;
  dataUrl: string;
};

async function uploadToProvider({
  base64,
  mediaType,
  filename,
  provider,
}: {
  base64: string;
  mediaType: string;
  filename: string;
  provider: string;
}): Promise<{ providerReference: Record<string, string> }> {
  const res = await fetch('/api/upload-file', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data: base64, mediaType, filename, provider }),
  });

  if (!res.ok) {
    throw new Error(`Upload failed: ${res.statusText}`);
  }

  const { providerReference } = await res.json();
  return { providerReference };
}

export default function UploadFilePage() {
  const [selectedModelIndex, setSelectedModelIndex] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [selectedFileIds, setSelectedFileIds] = useState<Set<string>>(
    new Set(),
  );
  const [uploadingIds, setUploadingIds] = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedModel = MODELS[selectedModelIndex];

  const { messages, setMessages, sendMessage, regenerate, status, error } =
    useChat({
      transport: new DefaultChatTransport({
        api: '/api/chat/upload-file',
      }),
    });

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setUploadingIds(prev => new Set(prev).add('new'));
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const base64 = dataUrl.split(',')[1];
      const { providerReference } = await uploadToProvider({
        base64,
        mediaType: file.type,
        filename: file.name,
        provider: selectedModel.provider,
      });

      const id = generateId();

      setUploadedFiles(prev => [
        ...prev,
        {
          id,
          filename: file.name,
          mediaType: file.type,
          providerReference,
          dataUrl,
        },
      ]);
      setSelectedFileIds(prev => new Set(prev).add(id));
    } finally {
      setUploadingIds(prev => {
        const next = new Set(prev);
        next.delete('new');
        return next;
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleUploadToProvider = async ({
    fileId,
    provider,
  }: {
    fileId: string;
    provider: string;
  }) => {
    const file = uploadedFiles.find(f => f.id === fileId);
    if (!file) {
      return;
    }

    setUploadingIds(prev => new Set(prev).add(fileId));
    try {
      const base64 = file.dataUrl.split(',')[1];
      const { providerReference } = await uploadToProvider({
        base64,
        mediaType: file.mediaType,
        filename: file.filename,
        provider,
      });

      const mergedReference = {
        ...file.providerReference,
        ...providerReference,
      };

      setUploadedFiles(prev =>
        prev.map(f =>
          f.id === fileId ? { ...f, providerReference: mergedReference } : f,
        ),
      );

      setMessages(prev =>
        prev.map(msg => ({
          ...msg,
          parts: msg.parts.map(part =>
            part.type === 'file' && part.url === file.dataUrl
              ? { ...part, providerReference: mergedReference }
              : part,
          ),
        })),
      );
    } finally {
      setUploadingIds(prev => {
        const next = new Set(prev);
        next.delete(fileId);
        return next;
      });
    }
  };

  const toggleFile = (id: string) => {
    setSelectedFileIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSend = (text: string) => {
    const files: FileUIPart[] = uploadedFiles
      .filter(f => selectedFileIds.has(f.id))
      .map(f => ({
        type: 'file' as const,
        url: f.dataUrl,
        mediaType: f.mediaType,
        filename: f.filename,
        providerReference: f.providerReference,
      }));

    sendMessage(
      { text, files },
      {
        body: {
          modelId: selectedModel.id,
          providerId: selectedModel.provider,
        },
      },
    );
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="flex w-64 flex-col gap-4 border-gray-200 border-r p-4">
        <h2 className="font-bold text-sm">Uploaded Files</h2>

        <div className="flex flex-1 flex-col gap-2 overflow-y-auto">
          {uploadedFiles.map(f => (
            <div className="flex flex-col gap-1 text-sm" key={f.id}>
              <label className="flex cursor-pointer items-start gap-2">
                <input
                  checked={selectedFileIds.has(f.id)}
                  className="mt-0.5"
                  onChange={() => toggleFile(f.id)}
                  type="checkbox"
                />
                {f.mediaType.startsWith('image/') && (
                  <img
                    alt={f.filename}
                    className="h-8 w-8 flex-shrink-0 rounded object-cover"
                    src={f.dataUrl}
                  />
                )}
                <div className="min-w-0">
                  <div className="truncate">{f.filename}</div>
                </div>
              </label>
              <div className="ml-5 flex flex-wrap gap-1">
                {Object.keys(f.providerReference).map(p => (
                  <span
                    className="rounded bg-green-100 px-1.5 py-0.5 text-green-800 text-xs"
                    key={p}
                  >
                    {p}
                  </span>
                ))}
                {!f.providerReference[selectedModel.provider] && (
                  <button
                    className="rounded bg-blue-100 px-1.5 py-0.5 text-blue-700 text-xs hover:bg-blue-200 disabled:opacity-50"
                    disabled={uploadingIds.has(f.id)}
                    onClick={() =>
                      handleUploadToProvider({
                        fileId: f.id,
                        provider: selectedModel.provider,
                      })
                    }
                    type="button"
                  >
                    {uploadingIds.has(f.id)
                      ? 'Uploading...'
                      : `Upload to ${selectedModel.provider}`}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div>
          <input
            className="text-sm"
            disabled={uploadingIds.has('new')}
            onChange={handleFileUpload}
            ref={fileInputRef}
            type="file"
          />
          {uploadingIds.has('new') && (
            <div className="mt-1 text-gray-500 text-xs">Uploading...</div>
          )}
        </div>
      </div>

      {/* Main area */}
      <div className="flex flex-1 flex-col">
        {/* Top bar */}
        <div className="flex items-center gap-4 border-gray-200 border-b p-4">
          <h1 className="font-bold">Upload File Chat</h1>
          <select
            className="rounded border border-gray-300 px-2 py-1 text-sm"
            onChange={e => setSelectedModelIndex(Number(e.target.value))}
            value={selectedModelIndex}
          >
            {MODELS.map((m, i) => (
              <option key={m.id} value={i}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="mx-auto flex max-w-2xl flex-col gap-4 pb-20">
            {messages.map(message => (
              <div className="flex flex-col gap-1" key={message.id}>
                <div className="font-bold text-gray-500 text-xs">
                  {message.role === 'user' ? 'User' : 'AI'}
                </div>
                {message.parts.map((part, index) => {
                  if (part.type === 'text') {
                    return (
                      <div className="whitespace-pre-wrap" key={index}>
                        {part.text}
                      </div>
                    );
                  }
                  if (part.type === 'file') {
                    return (
                      <div
                        className="inline-block rounded bg-gray-100 px-2 py-1 text-gray-500 text-xs"
                        key={index}
                      >
                        📎 {part.filename ?? 'file'}
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            ))}

            {error && (
              <div className="mt-4">
                <div className="text-red-500">An error occurred.</div>
                <button
                  className="mt-4 rounded-md border border-blue-500 px-4 py-2 text-blue-500"
                  onClick={() =>
                    regenerate({
                      body: {
                        modelId: selectedModel.id,
                        providerId: selectedModel.provider,
                      },
                    })
                  }
                  type="button"
                >
                  Retry
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Input */}
        <div className="border-gray-200 border-t p-4">
          <div className="mx-auto max-w-2xl">
            <ChatInput onSubmit={handleSend} status={status} />
          </div>
        </div>
      </div>
    </div>
  );
}
