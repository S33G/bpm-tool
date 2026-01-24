import Link from 'next/link';
import { ReactNode } from 'react';

interface ToolCardProps {
  href: string;
  title: string;
  description: string;
  icon: ReactNode;
  color?: 'blue' | 'purple' | 'green' | 'orange' | 'pink' | 'cyan' | 'yellow' | 'teal' | 'slate';
}

const colorClasses = {
  blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  green: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
  orange: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
  pink: 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400',
  cyan: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400',
  yellow: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
  teal: 'bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400',
  slate: 'bg-slate-200 text-slate-600 dark:bg-slate-800/50 dark:text-slate-400',
};

export function ToolCard({ href, title, description, icon, color = 'blue' }: ToolCardProps) {
  return (
    <Link
      href={href}
      className="group fade-up flex flex-col rounded-2xl border border-white/70 bg-white/80 p-6 shadow-lg shadow-zinc-900/5 backdrop-blur transition-all duration-200 hover:-translate-y-1 hover:border-white/90 hover:shadow-xl hover:shadow-zinc-900/10 dark:border-white/10 dark:bg-zinc-900/70 dark:hover:border-white/20"
    >
      <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl shadow-sm ${colorClasses[color]}`}>
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-semibold text-zinc-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-300">
        {title}
      </h3>
      <p className="text-sm text-zinc-600 dark:text-zinc-300">
        {description}
      </p>
    </Link>
  );
}
