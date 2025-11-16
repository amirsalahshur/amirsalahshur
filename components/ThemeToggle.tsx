'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';
import { cn } from '@/lib/utils';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background/50 backdrop-blur-sm transition-colors hover:bg-muted"
        aria-label="Toggle theme"
      >
        <FiSun className="h-5 w-5" />
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className={cn(
        'relative inline-flex h-10 w-10 items-center justify-center rounded-lg',
        'border border-border bg-background/50 backdrop-blur-sm',
        'transition-all duration-300 hover:bg-muted hover:scale-105',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
      )}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? (
        <FiMoon className="h-5 w-5 text-primary transition-transform duration-300 rotate-0" />
      ) : (
        <FiSun className="h-5 w-5 text-primary transition-transform duration-300 rotate-0" />
      )}
    </button>
  );
}
