import type { FetchPDFUIToolInvocation } from '@/tool/fetch-pdf-tool';

export default function FetchPDFView({
  invocation,
}: {
  invocation: FetchPDFUIToolInvocation;
}) {
  switch (invocation.state) {
    case 'input-available':
      return (
        <div className="mb-2 rounded-xl border border-gray-600 bg-gray-900 shadow-lg">
          Fetching PDF...
        </div>
      );
    case 'output-available':
      return (
        <div className="mb-2 rounded-xl border border-gray-600 bg-gray-900 p-4 shadow-lg">
          <div className="mb-2 font-semibold text-gray-300">PDF Result</div>
          <a
            className="text-blue-400 underline"
            download="test.pdf"
            href={`data:application/pdf;base64,${invocation.output.base64}`}
            rel="noopener"
            target="_blank"
          >
            Download PDF
          </a>
        </div>
      );
  }
}
