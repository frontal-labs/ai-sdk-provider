'use client';

/* eslint-disable @next/next/no-img-element */
import { useChat } from '@ai-sdk/react';
import { useRef, useState } from 'react';

export default function Page() {
  const [input, setInput] = useState('');
  const { messages, sendMessage, status } = useChat();

  const [files, setFiles] = useState<FileList | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-2 p-2">
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
              })}
            </div>
          </div>
        ))}
      </div>

      <form
        className="fixed bottom-0 flex w-full flex-col gap-2 p-2"
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
        <div className="fixed right-2 bottom-14 flex flex-row items-end gap-2">
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
          className="w-full bg-zinc-100 p-2"
          disabled={status !== 'ready'}
          onChange={e => setInput(e.target.value)}
          placeholder="Send message..."
          value={input}
        />
      </form>
    </div>
  );
}
