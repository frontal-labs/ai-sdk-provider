'use client';

import { useCompletion } from '@ai-sdk/react';

export default function Page() {
  const {
    completion,
    input,
    handleInputChange,
    handleSubmit,
    error,
    isLoading,
    stop,
  } = useCompletion();

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
      {isLoading && (
        <div className="mt-4 text-gray-500">
          <div>Loading...</div>
          <button
            className="mt-4 rounded-md border border-blue-500 px-4 py-2 text-blue-500"
            onClick={stop}
            type="button"
          >
            Stop
          </button>
        </div>
      )}
      {completion}
      <form onSubmit={handleSubmit}>
        <input
          className="fixed bottom-0 mb-8 w-full max-w-md rounded border border-gray-300 p-2 shadow-xl"
          disabled={isLoading}
          onChange={handleInputChange}
          placeholder="Say something..."
          value={input}
        />
      </form>
    </div>
  );
}
