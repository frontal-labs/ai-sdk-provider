import './globals.css';
import { MobileNav } from '../components/mobile-nav';
import { Sidebar } from '../components/sidebar';

export const metadata = {
  title: 'AI SDK + LangChain Examples',
  description:
    'Example applications showcasing AI SDK with LangChain integration',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className="flex h-screen flex-col overflow-hidden lg:flex-row"
        suppressHydrationWarning
      >
        <Sidebar />
        <div className="relative flex flex-1 flex-col overflow-hidden bg-[var(--background)]">
          <MobileNav />
          <main className="m-2 flex flex-1 flex-col overflow-hidden rounded-xl border border-[var(--border-hover)] bg-[var(--background-secondary)] lg:m-3">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
