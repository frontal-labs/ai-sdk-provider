import { useChat } from '@ai-sdk/react';
import { useState } from 'react';
import { useSharedChatContext } from './chat-context';

export default function ChatInput() {
  const { chat } = useSharedChatContext();
  const [text, setText] = useState('');
  const { status, stop, sendMessage } = useChat({ chat });

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        if (text.trim() === '') {
          return;
        }
        sendMessage({ text });
        setText('');
      }}
    >
      <input
        className="fixed bottom-0 mb-8 w-full max-w-md rounded border border-gray-300 p-2 shadow-xl"
        disabled={status !== 'ready'}
        onChange={e => setText(e.target.value)}
        placeholder="Say something..."
        value={text}
      />
      {stop && (status === 'streaming' || status === 'submitted') && (
        <button
          className="fixed bottom-0 mb-8 w-full max-w-md rounded border border-gray-300 p-2 shadow-xl"
          onClick={stop}
          type="submit"
        >
          Stop
        </button>
      )}
    </form>
  );
}
