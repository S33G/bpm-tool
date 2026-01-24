import { ReactNode } from 'react';

interface ToolLayoutProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function ToolLayout({ title, description, children }: ToolLayoutProps) {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <section className="mb-10 text-center fade-up">
        <h1 className="mb-3 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="mx-auto max-w-2xl text-base text-zinc-600 dark:text-zinc-300">
            {description}
          </p>
        )}
      </section>
      {children}
    </main>
  );
}
