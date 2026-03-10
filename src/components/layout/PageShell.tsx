import type { ReactNode } from 'react';

interface PageShellProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export function PageShell({ title, subtitle, children }: PageShellProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="mb-6">
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl">
          {title}
        </h1>
        {subtitle && (
          <p className="text-text-secondary text-sm mt-1">{subtitle}</p>
        )}
      </div>
      {children}
    </div>
  );
}
