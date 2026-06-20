'use client';

/* eslint-disable @next/next/no-img-element */
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { FileIcon } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';

export default function Page() {
  const [input, setInput] = useState('');

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: '/api/chat/anthropic-compaction',
      }),
    [],
  );

  const { messages, sendMessage, status } = useChat({
    transport,
  });

  const [files, setFiles] = useState<FileList | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col gap-2">
      <div className="border-blue-200 border-b bg-blue-50 p-2">
        <h1 className="font-bold text-lg">Anthropic Compaction Test</h1>
        <p className="text-sm text-zinc-600">
          Context is pre-loaded with a large document corpus (~50k tokens) and 5
          conversation turns. Your messages will be appended to this context.
          Compaction should trigger soon - summaries will be highlighted in
          yellow.
        </p>
        <p className="mt-1 text-xs text-zinc-500">
          Try asking: &quot;Summarize the key algorithms and data structures
          from the documentation&quot;
        </p>
      </div>

      <div className="flex flex-col gap-2 p-2 pb-40">
        {messages.map(message => (
          <div className="flex flex-row gap-2" key={message.id}>
            <div className="w-24 flex-shrink-0 text-zinc-500">{`${message.role}: `}</div>

            <div className="flex flex-col gap-2">
              {message.parts.map((part, index) => {
                if (part.type === 'text') {
                  // Check if this is a compaction summary
                  const isCompaction =
                    (
                      part.providerMetadata?.anthropic as
                        | { type?: string }
                        | undefined
                    )?.type === 'compaction';

                  if (isCompaction) {
                    return (
                      <div
                        className="rounded border-yellow-500 border-l-4 bg-yellow-100 p-3"
                        key={index}
                      >
                        <div className="mb-2 flex items-center gap-2">
                          <span className="font-bold text-yellow-700">
                            [COMPACTION SUMMARY]
                          </span>
                          <span className="rounded bg-yellow-200 px-2 py-0.5 text-xs text-yellow-600">
                            Context was compressed
                          </span>
                        </div>
                        <div className="whitespace-pre-wrap text-yellow-900">
                          {part.text}
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div className="whitespace-pre-wrap" key={index}>
                      {part.text}
                    </div>
                  );
                }
                if (
                  part.type === 'file' &&
                  part.mediaType?.startsWith('image/')
                ) {
                  return (
                    <div key={index}>
                      <img
                        alt={part.filename}
                        className="w-60 rounded-md"
                        src={part.url}
                      />
                      <span className="text-sm text-zinc-500">
                        {part.filename}
                      </span>
                    </div>
                  );
                }
                if (part.type === 'file') {
                  return (
                    <div
                      className="flex items-center gap-2 rounded bg-zinc-100 p-2"
                      key={index}
                    >
                      <span className="text-sm text-zinc-600">
                        {part.filename}
                      </span>
                    </div>
                  );
                }
              })}
            </div>
          </div>
        ))}

        {status === 'streaming' && (
          <div className="text-sm text-zinc-400">Streaming...</div>
        )}
      </div>

      <form
        className="fixed right-0 bottom-0 left-0 flex w-full flex-col gap-2 border-t bg-white p-2"
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
        <div className="flex flex-row items-end gap-2 overflow-x-auto pb-2">
          {files
            ? Array.from(files).map(attachment => {
                const { type } = attachment;

                if (type.startsWith('image/')) {
                  return (
                    <div className="flex-shrink-0" key={attachment.name}>
                      <img
                        alt={attachment.name}
                        className="w-24 rounded-md"
                        src={URL.createObjectURL(attachment)}
                      />
                      <span className="text-sm text-zinc-500">
                        {attachment.name}
                      </span>
                    </div>
                  );
                }
                return (
                  <div
                    className="flex w-24 flex-shrink-0 flex-col gap-1 text-sm text-zinc-500"
                    key={attachment.name}
                  >
                    <div className="flex h-20 w-16 items-center justify-center rounded-md bg-zinc-100">
                      <FileIcon className="h-4 w-4 text-zinc-400" />
                    </div>
                    <span className="truncate">{attachment.name}</span>
                  </div>
                );
              })
            : null}
        </div>
        <div className="flex gap-2">
          <input
            className="text-sm"
            multiple
            onChange={event => {
              if (event.target.files) {
                setFiles(event.target.files);
              }
            }}
            ref={fileInputRef}
            type="file"
          />
        </div>
        <input
          className="w-full rounded bg-zinc-100 p-2"
          disabled={status !== 'ready'}
          onChange={e => setInput(e.target.value)}
          placeholder="Send message..."
          value={input}
        />
      </form>
    </div>
  );
}
