'use client';

import { BookOpen, ExternalLink, Github } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navItems } from '../app/constants';

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden h-screen w-72 flex-col border-[var(--border)] border-r bg-[var(--background-secondary)] lg:flex">
      {/* Logo */}
      <div className="flex items-center gap-3 border-[var(--border)] border-b p-5">
        <div className="flex h-9 w-9 items-center justify-center whitespace-nowrap rounded-lg border border-[var(--border)] bg-[var(--background-tertiary)] text-xs leading-none">
          <span>🦜</span>
          <span>🔗</span>
        </div>
        <div>
          <h1 className="font-semibold text-[var(--foreground)]">LangChain</h1>
          <p className="text-[var(--foreground-muted)] text-xs">
            AI SDK Examples
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        <div className="px-3 py-2 font-semibold text-[var(--foreground-secondary)] text-xs uppercase tracking-wider">
          Examples
        </div>
        {navItems.map(item => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              className={`group flex items-start gap-3 rounded-lg px-3 py-3 transition-all ${
                isActive
                  ? 'bg-[var(--accent-light)] text-[var(--accent)]'
                  : 'text-[var(--foreground-secondary)] hover:bg-[var(--background-tertiary)] hover:text-[var(--foreground)]'
              }`}
              href={item.href}
              key={item.href}
            >
              <span
                className={`mt-0.5 flex-shrink-0 ${isActive ? 'text-[var(--accent)]' : 'text-[var(--foreground-secondary)] group-hover:text-[var(--foreground)]'}`}
              >
                <Icon className="h-5 w-5" strokeWidth={1.5} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate font-medium">{item.label}</span>
                  {item.badge && (
                    <span className="rounded bg-[var(--accent-light)] px-1.5 py-0.5 font-medium text-[10px] text-[var(--accent)]">
                      {item.badge}
                    </span>
                  )}
                </div>
                <p className="mt-0.5 truncate text-[var(--foreground-secondary)] text-xs opacity-80">
                  {item.description}
                </p>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-[var(--border)] border-t p-4">
        <a
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-[var(--foreground-secondary)] text-sm transition-colors hover:bg-[var(--background-tertiary)] hover:text-[var(--foreground)]"
          href="https://ai-sdk.dev/providers/adapters/langchain#langchain"
          rel="noopener noreferrer"
          target="_blank"
        >
          <BookOpen className="h-4 w-4" strokeWidth={1.5} />
          Documentation
          <ExternalLink className="ml-auto h-3 w-3" strokeWidth={2} />
        </a>
        <a
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-[var(--foreground-secondary)] text-sm transition-colors hover:bg-[var(--background-tertiary)] hover:text-[var(--foreground)]"
          href="https://github.com/vercel/ai/tree/main/examples/next-langchain"
          rel="noopener noreferrer"
          target="_blank"
        >
          <Github className="h-4 w-4" strokeWidth={1.5} />
          GitHub
          <ExternalLink className="ml-auto h-3 w-3" strokeWidth={2} />
        </a>
      </div>
    </aside>
  );
}
