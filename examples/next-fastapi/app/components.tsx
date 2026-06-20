import { GeistMono } from 'geist/font/mono';
import Link from 'next/link';
import type { ReactNode } from 'react';

const Code = ({ children }: { children: ReactNode }) => (
  <code
    className={`${GeistMono.className} rounded-md border bg-zinc-100 p-1 text-xs`}
  >
    {children}
  </code>
);

export const Card = ({ type }: { type: string }) =>
  type === 'chat-text' ? (
    <div className="fixed bottom-20 w-full self-center px-8 py-6">
      <div className="flex w-full flex-col gap-2 rounded-lg border p-4">
        <div className="text font-semibold text-zinc-800">
          Stream Chat Completions
        </div>
        <div className="flex flex-col gap-4 text-sm text-zinc-500 leading-6">
          <p>
            The <Code>useChat</Code> hook can be integrated with a Python
            FastAPI backend to stream chat completions in real-time. The most
            basic setup involves streaming plain text chunks by setting the{' '}
            <Code>streamProtocol</Code> to <Code>text</Code>.
          </p>

          <p>
            To make your responses streamable, you will have to use the{' '}
            <Code>StreamingResponse</Code> class provided by FastAPI.
          </p>
        </div>
      </div>
    </div>
  ) : type === 'chat-data' ? (
    <div className="fixed bottom-20 w-full self-center px-8 py-6">
      <div className="flex w-full flex-col gap-2 rounded-lg border p-4">
        <div className="text font-semibold text-zinc-800">
          Stream Chat Completions with Tools
        </div>
        <div className="flex flex-col gap-4 text-sm text-zinc-500 leading-6">
          <p>
            The <Code>useChat</Code> hook can be integrated with a Python
            FastAPI backend to stream chat completions in real-time. However,
            the most basic setup that involves streaming plain text chunks by
            setting the <Code>streamProtocol</Code> to <Code>text</Code> is
            limited.
          </p>

          <p>
            As a result, setting the streamProtocol to <Code>data</Code> allows
            you to stream chunks that include information about tool calls and
            results.
          </p>

          <p>
            To make your responses streamable, you will have to use the{' '}
            <Code>StreamingResponse</Code> class provided by FastAPI. You will
            also have to ensure that your chunks follow the{' '}
            <Link
              className="text-blue-500 hover:underline"
              href="https://ai-sdk.dev/docs/ai-sdk-ui/stream-protocol#data-stream-protocol"
              target="_blank"
            >
              data stream protocol
            </Link>{' '}
            and that the response has <Code>x-vercel-ai-data-stream</Code>{' '}
            header set to <Code>v1</Code>.
          </p>
        </div>
      </div>
    </div>
  ) : type === 'chat-attachments' ? (
    <div className="fixed top-14 w-full self-center px-8 py-6">
      <div className="flex w-full flex-col gap-2 rounded-lg border p-4">
        <div className="text font-semibold text-zinc-800">
          Stream Chat Completions with Attachments
        </div>
        <div className="flex flex-col gap-4 text-sm text-zinc-500 leading-6">
          <p>
            The <Code>useChat</Code> hook can be integrated with a Python
            FastAPI backend to stream chat completions in real-time. To make
            your responses streamable, you will have to use the{' '}
            <Code>StreamingResponse</Code> class provided by FastAPI.
          </p>

          <p>
            Furthermore, you can send files along with your messages by setting{' '}
            <Code>experimental_attachments</Code> to <Code>true</Code> in{' '}
            <Code>handleSubmit</Code>. This will allow you to use process these
            attachments in your FastAPI backend.
          </p>
        </div>
      </div>
    </div>
  ) : null;
