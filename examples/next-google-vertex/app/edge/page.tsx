'use client';

import { useState } from 'react';

export default function Home() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const generateText = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/generate-edge');
      const data = await response.json();
      setResult(data.message);
    } catch (error) {
      console.error('Error:', error);
      setResult('Failed to generate text');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <main className="flex flex-col items-center gap-4">
        <h1 className="font-medium text-gray-700 text-xl">
          Demo text generation with Google Vertex using Edge-compatible
          authentication
        </h1>
        <button
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:bg-gray-400"
          disabled={loading}
          onClick={generateText}
        >
          {loading ? 'Generating...' : 'Generate Text'}
        </button>

        {result && (
          <div className="mt-4 max-w-2xl rounded border p-4">{result}</div>
        )}
      </main>
    </div>
  );
}
