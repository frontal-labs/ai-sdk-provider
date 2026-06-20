'use client';

import { useState } from 'react';

export default function Page() {
  const [inputValue, setInputValue] = useState('');
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsLoading(true);
    setImageSrc(null);
    setError(null);

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: inputValue }),
      });

      if (response.ok) {
        const image = await response.json();
        setImageSrc(`data:image/png;base64,${image}`);
        return;
      }

      setError(await response.text());
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center p-24">
      <div className="space-y-2">
        <h2 className="text-center font-bold text-3xl tracking-tighter sm:text-4xl md:text-5xl">
          Image Generator
        </h2>
        <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
          Generate images.
        </p>
      </div>

      <div className="w-full max-w-sm space-y-2 pt-6 pb-8">
        <form className="flex space-x-2" onSubmit={handleSubmit}>
          <input
            className="max-w-lg flex-1 rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100"
            disabled={isLoading}
            onChange={e => setInputValue(e.target.value)}
            placeholder="Describe the image"
            type="text"
            value={inputValue}
          />
          <button
            className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-blue-300"
            disabled={isLoading}
            type="submit"
          >
            Generate
          </button>
        </form>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-400 bg-red-100 p-4 text-red-700">
          {error}
        </div>
      )}

      <div className="h-[512px] w-[512px] space-y-2">
        {isLoading ? (
          <div className="h-[512px] w-[512px] animate-pulse rounded-lg bg-gray-200" />
        ) : (
          imageSrc && (
            <img
              alt="Generated Image"
              className="overflow-hidden rounded-lg object-cover"
              src={imageSrc}
            />
          )
        )}
      </div>
    </div>
  );
}
