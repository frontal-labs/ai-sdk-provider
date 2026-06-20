'use client';

import { useCompletion } from '@ai-sdk/react';

export default function Chat() {
  const { completion, input, handleInputChange, handleSubmit, error } =
    useCompletion({
      api: '/api/use-completion-server-side-multi-step',
    });

  return (
    <div className="stretch mx-auto flex w-full max-w-md flex-col py-24">
      <h4 className="pb-4 font-bold text-gray-900 text-xl md:text-xl">
        useCompletion Example
      </h4>
      {error && (
        <div className="fixed top-0 left-0 w-full bg-red-500 p-4 text-center text-white">
          {error.message}
        </div>
      )}
      {completion}
      <form onSubmit={handleSubmit}>
        <input
          className="fixed bottom-0 mb-8 w-full max-w-md rounded border border-gray-300 p-2 shadow-xl"
          onChange={handleInputChange}
          placeholder="What is the weather in Berlin?"
          value={input}
        />
      </form>
    </div>
  );
}
