'use client';

interface StepToggleProps {
  active: boolean;
  accent: boolean;
  index: number;
  onToggle: () => void;
  onAccentToggle: () => void;
}

export function StepToggle({ active, accent, index, onToggle, onAccentToggle }: StepToggleProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (e.shiftKey) {
      onAccentToggle();
    } else {
      onToggle();
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`relative h-8 w-8 rounded-md border text-xs font-medium transition-colors ${
        active
          ? accent
            ? 'border-blue-600 bg-blue-500 text-white'
            : 'border-blue-400 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
          : 'border-zinc-200 bg-white text-zinc-400 hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-500'
      }`}
      aria-label={`Step ${index + 1}`}
    >
      {index + 1}
      {accent && (
        <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-blue-700" />
      )}
    </button>
  );
}
