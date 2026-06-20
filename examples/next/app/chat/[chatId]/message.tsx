import type { ChatStatus } from 'ai';
import type { MyUIMessage } from '@/util/chat-schema';

export default function Message({
  message,
  status,
  regenerate,
  sendMessage,
}: {
  status: ChatStatus;
  message: MyUIMessage;
  regenerate: ({ messageId }: { messageId: string }) => void;
  sendMessage: ({
    text,
    messageId,
  }: {
    text: string;
    messageId?: string;
  }) => void;
}) {
  const date = message.metadata?.createdAt
    ? new Date(message.metadata.createdAt).toLocaleString()
    : '';
  const isUser = message.role === 'user';

  return (
    <div
      className={`my-2 whitespace-pre-wrap rounded-lg p-3 shadow ${isUser ? 'ml-10 bg-blue-100 text-right' : 'mr-10 bg-gray-100 text-left'}`}
    >
      <div className="mb-1 text-gray-500 text-xs">{date}</div>
      <div className="font-semibold">{isUser ? 'User:' : 'AI:'}</div>
      <div>
        {message.parts
          .map(part => (part.type === 'text' ? part.text : ''))
          .join('')}
      </div>
      {message.role === 'user' && (
        <>
          <button
            className="mt-2 rounded-md bg-gray-200 px-3 py-1 text-sm transition-colors hover:bg-gray-300"
            disabled={status !== 'ready'}
            onClick={() => regenerate({ messageId: message.id })}
          >
            Regenerate
          </button>
          <button
            className="mt-2 rounded-md bg-gray-200 px-3 py-1 text-sm transition-colors hover:bg-gray-300"
            disabled={status !== 'ready'}
            onClick={() =>
              sendMessage({ text: 'Hello', messageId: message.id })
            }
          >
            Replace with Hello
          </button>
        </>
      )}
    </div>
  );
}
