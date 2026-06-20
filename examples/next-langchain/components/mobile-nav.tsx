'use client';

import { ExternalLink, Menu, X, Zap } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { navItems } from '../app/constants';

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const currentPage = navItems.find(item => item.href === pathname);

  return (
    <div className="lg:hidden">
      {/* Mobile header */}
      <div className="flex items-center justify-between border-[var(--border)] border-b bg-[var(--background-secondary)] p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-600 to-yellow-500">
            <Zap className="h-4 w-4 text-white" strokeWidth={2} />
          </div>
          <div>
            <h1 className="font-semibold text-[var(--foreground)] text-sm">
              {currentPage?.label || 'AI SDK + LangChain'}
            </h1>
          </div>
        </div>
        <button
          aria-label="Toggle menu"
          className="rounded-lg p-2 transition-colors hover:bg-[var(--background-tertiary)]"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <X className="h-6 w-6 text-[var(--foreground)]" strokeWidth={2} />
          ) : (
            <Menu
              className="h-6 w-6 text-[var(--foreground)]"
              strokeWidth={2}
            />
          )}
        </button>
      </div>

      {/* Mobile menu dropdown */}
      {isOpen && (
        <div className="absolute top-[65px] right-0 left-0 z-50 animate-fade-in border-[var(--border)] border-b bg-[var(--background-secondary)] shadow-lg">
          <nav className="space-y-2 p-4">
            {navItems.map(item => {
              const isActive = pathname === item.href;
              return (
                <Link
                  className={`flex flex-col rounded-lg px-4 py-3 transition-all ${
                    isActive
                      ? 'bg-[var(--accent-light)] text-[var(--accent)]'
                      : 'text-[var(--foreground-secondary)] hover:bg-[var(--background-tertiary)]'
                  }`}
                  href={item.href}
                  key={item.href}
                  onClick={() => setIsOpen(false)}
                >
                  <span className="font-medium">{item.label}</span>
                  <span className="text-[var(--foreground-secondary)] text-xs">
                    {item.description}
                  </span>
                </Link>
              );
            })}
          </nav>
          <div className="mt-2 border-[var(--border)] border-t p-4 pt-0">
            <a
              className="flex items-center gap-2 px-4 py-2 text-[var(--foreground-secondary)] text-sm hover:text-[var(--foreground)]"
              href="https://sdk.vercel.ai/docs"
              rel="noopener noreferrer"
              target="_blank"
            >
              Documentation
              <ExternalLink className="h-3 w-3" strokeWidth={2} />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
