import { ReactNode } from 'react';

interface ToolLayoutProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function ToolLayout({ title, description, children }: ToolLayoutProps) {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <section className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold text-zinc-900 dark:text-white">
          {title}
        </h1>
        {description && (
          <p className="mx-auto max-w-2xl text-zinc-600 dark:text-zinc-400">
            {description}
          </p>
        )}
      </section>
      {children}
    </main>
  );
}
