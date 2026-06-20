'use client';

/* eslint-disable @next/next/no-img-element */
import { useChat } from '@ai-sdk/react';
import { useRef, useState } from 'react';
import { Card } from '@/app/components';

export default function Page() {
  const [input, setInput] = useState('');
  const { messages, sendMessage, status } = useChat();

  const [files, setFiles] = useState<FileList | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-2 p-4">
        {messages.map(message => (
          <div className="flex flex-row gap-2" key={message.id}>
            <div className="w-24 flex-shrink-0 text-zinc-500">{`${message.role}: `}</div>
            <div className="flex flex-col gap-2">
              {message.parts.map((part, index) => {
                if (part.type === 'text') {
                  return <div key={index}>{part.text}</div>;
                }
                if (
                  part.type === 'file' &&
                  part.mediaType?.startsWith('image/')
                ) {
                  return (
                    <div key={index}>
                      <img className="w-60 rounded-md" src={part.url} />
                    </div>
                  );
                }
              })}
            </div>
          </div>
        ))}
      </div>

      {messages.length === 0 && <Card type="chat-attachments" />}

      <form
        className="fixed bottom-0 flex h-28 w-full flex-col gap-3 border-t p-4"
        onSubmit={event => {
          sendMessage({ text: input, files });
          setInput('');
          setFiles(undefined);

          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }}
      >
        <div className="fixed right-8 bottom-32 flex flex-row items-end gap-2">
          {files
            ? Array.from(files).map(attachment => {
                const { type } = attachment;

                if (type.startsWith('image/')) {
                  return (
                    <div key={attachment.name}>
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
                if (type.startsWith('text/')) {
                  return (
                    <div
                      className="flex w-24 flex-shrink-0 flex-col gap-1 text-sm text-zinc-500"
                      key={attachment.name}
                    >
                      <div className="h-20 w-16 rounded-md bg-zinc-100" />
                      {attachment.name}
                    </div>
                  );
                }
              })
            : ''}
        </div>
        <input
          multiple
          onChange={event => {
            if (event.target.files) {
              setFiles(event.target.files);
            }
          }}
          ref={fileInputRef}
          type="file"
        />
        <input
          className="w-full bg-transparent outline-none"
          disabled={status !== 'ready'}
          onChange={e => setInput(e.target.value)}
          placeholder="What's the weather in San Francisco?"
          value={input}
        />
      </form>
    </div>
  );
}
