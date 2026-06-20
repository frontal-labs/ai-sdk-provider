'use client';

/* eslint-disable @next/next/no-img-element */
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useRef, useState } from 'react';

export default function Page() {
  const [input, setInput] = useState('');
  const { messages, sendMessage, status, error, regenerate } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat/xai-image-edit',
    }),
  });

  const [files, setFiles] = useState<FileList | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="stretch mx-auto flex w-full max-w-md flex-col py-24">
      {messages.map(message => (
        <div className="mb-4 whitespace-pre-wrap" key={message.id}>
          <div className="font-bold">
            {message.role === 'user' ? 'User: ' : 'AI: '}
          </div>
          {message.parts.map((part, index) => {
            if (part.type === 'text') {
              return <div key={index}>{part.text}</div>;
            }
            if (part.type === 'file' && part.mediaType?.startsWith('image/')) {
              return (
                <img
                  alt="Generated image"
                  className="mt-2 max-w-full rounded-md"
                  key={index}
                  src={part.url}
                />
              );
            }
          })}
        </div>
      ))}

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

      <form
        className="fixed bottom-0 flex w-full max-w-md flex-col gap-2 p-2"
        onSubmit={e => {
          e.preventDefault();
          sendMessage({ text: input, files });
          setFiles(undefined);
          setInput('');
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }}
      >
        <div className="flex flex-row items-end gap-2">
          {files
            ? Array.from(files).map(file =>
                file.type.startsWith('image/') ? (
                  <div key={file.name}>
                    <img
                      alt={file.name}
                      className="w-16 rounded-md"
                      src={URL.createObjectURL(file)}
                    />
                    <span className="text-xs text-zinc-500">{file.name}</span>
                  </div>
                ) : null,
              )
            : null}
        </div>
        <input
          accept="image/*"
          multiple
          onChange={e => {
            if (e.target.files) {
              setFiles(e.target.files);
            }
          }}
          ref={fileInputRef}
          type="file"
        />
        <input
          className="w-full bg-zinc-100 p-2"
          disabled={status !== 'ready'}
          onChange={e => setInput(e.target.value)}
          placeholder="Describe what to generate or edit..."
          value={input}
        />
      </form>
    </div>
  );
}
