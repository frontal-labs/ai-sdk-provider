import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="mb-8 font-bold text-4xl">Google Vertex AI Demo</h1>
      <div className="flex gap-4">
        <Link
          className="rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
          href="/edge"
        >
          Edge Runtime Demo
        </Link>
        <Link
          className="rounded bg-green-500 px-4 py-2 text-white transition-colors hover:bg-green-600"
          href="/node"
        >
          Node Runtime Demo
        </Link>
      </div>
    </main>
  );
}
