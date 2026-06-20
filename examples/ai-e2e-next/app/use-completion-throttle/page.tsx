'use client';

import { useCompletion } from '@ai-sdk/react';
import { useLayoutEffect, useRef } from 'react';

export default function Chat() {
  const renderCount = useRef(0);
  useLayoutEffect(() => {
    console.log(`component rendered #${++renderCount.current}`);
  });

  const { completion, input, handleInputChange, handleSubmit } = useCompletion({
    api: '/api/use-completion-throttle',
    experimental_throttle: 50,
  });

  return (
    <div className="stretch mx-auto flex w-full max-w-md flex-col py-24">
      <h4 className="pb-4 font-bold text-gray-900 text-xl md:text-xl">
        useCompletion throttle example
      </h4>
      {completion}
      <form onSubmit={handleSubmit}>
        <input
          className="fixed bottom-0 mb-8 w-full max-w-md rounded border border-gray-300 p-2 shadow-xl"
          onChange={handleInputChange}
          placeholder="Book topic..."
          value={input}
        />
      </form>
    </div>
  );
}
