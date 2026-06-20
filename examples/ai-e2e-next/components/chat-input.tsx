import { useState } from 'react';

export default function ChatInput({
  status,
  onSubmit,
  stop,
}: {
  status: string;
  onSubmit: (text: string) => void;
  stop?: () => void;
}) {
  const [text, setText] = useState('');

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        if (text.trim() === '') {
          return;
        }
        onSubmit(text);
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
