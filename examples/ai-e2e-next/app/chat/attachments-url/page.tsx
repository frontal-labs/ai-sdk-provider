'use client';

/* eslint-disable @next/next/no-img-element */
import { useChat } from '@ai-sdk/react';
import { upload } from '@vercel/blob/client';
import type { FileUIPart } from 'ai';
import { useRef, useState } from 'react';

export default function Page() {
  const [input, setInput] = useState('');
  const { messages, sendMessage, status } = useChat();

  const [files, setFiles] = useState<FileUIPart[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
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
        onSubmit={event => {
          if (isUploading) {
            alert('Please wait for the files to finish uploading.');
            return;
          }

          sendMessage({ text: input, files });
          setInput('');
          setFiles([]);

          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }}
      >
        <div className="fixed right-2 bottom-14 flex flex-row items-end gap-2">
          {Array.from(files)
            .filter(file => file.mediaType?.startsWith('image/'))
            .map(file => (
              <div key={file.url}>
                <img
                  alt={file.filename}
                  className="w-24 rounded-md"
                  src={file.url}
                />
                <span className="text-sm text-zinc-500">{file.filename}</span>
              </div>
            ))}
        </div>
        <input
          multiple
          onChange={async event => {
            if (event.target.files) {
              setIsUploading(true);

              for (const file of Array.from(event.target.files)) {
                const blob = await upload(file.name, file, {
                  access: 'public',
                  handleUploadUrl: '/api/files',
                });

                setFiles(prevFiles => [
                  ...prevFiles,
                  {
                    type: 'file' as const,
                    filename: file.name,
                    mediaType: blob.contentType ?? '*/*',
                    url: blob.url,
                  },
                ]);
              }

              setIsUploading(false);
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
