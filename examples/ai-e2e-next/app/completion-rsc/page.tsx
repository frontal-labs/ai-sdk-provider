'use client';

import { readStreamableValue } from '@ai-sdk/rsc';
import { useState } from 'react';
import { generateCompletion } from './generate-completion';

export default function Chat() {
  const [input, setInput] = useState('');
  const [completion, setCompletion] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  return (
    <div className="stretch mx-auto flex w-full max-w-md flex-col py-24">
      <h4 className="pb-4 font-bold text-gray-900 text-xl md:text-xl">
        RSC Completion Example
      </h4>

      {completion}
      <form
        onSubmit={async e => {
          e.preventDefault();

          const streamableCompletion = await generateCompletion(input);
          for await (const text of readStreamableValue(streamableCompletion)) {
            setCompletion(text ?? '');
          }
        }}
      >
        <input
          className="fixed bottom-0 mb-8 w-full max-w-md rounded border border-gray-300 p-2 shadow-xl"
          onChange={handleInputChange}
          placeholder="Say something..."
          value={input}
        />
      </form>
    </div>
  );
}
