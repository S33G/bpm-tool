'use client';

import { useState, useEffect, useCallback } from 'react';
import { MIN_BPM, MAX_BPM } from '@/lib/constants';

interface BpmInputProps {
  value: number;
  onChange: (bpm: number) => void;
}

export function BpmInput({ value, onChange }: BpmInputProps) {
  const [inputValue, setInputValue] = useState(value.toString());

  // Sync input with external value changes
  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    const numValue = parseInt(newValue, 10);
    if (!isNaN(numValue) && numValue >= MIN_BPM && numValue <= MAX_BPM) {
      onChange(numValue);
    }
  };

  const handleBlur = () => {
    const numValue = parseInt(inputValue, 10);
    if (isNaN(numValue) || numValue < MIN_BPM) {
      setInputValue(MIN_BPM.toString());
      onChange(MIN_BPM);
    } else if (numValue > MAX_BPM) {
      setInputValue(MAX_BPM.toString());
      onChange(MAX_BPM);
    }
  };

  const increment = useCallback(() => {
    const newValue = Math.min(value + 1, MAX_BPM);
    onChange(newValue);
  }, [value, onChange]);

  const decrement = useCallback(() => {
    const newValue = Math.max(value - 1, MIN_BPM);
    onChange(newValue);
  }, [value, onChange]);

  return (
    <div className="flex flex-col items-center gap-2">
      <label htmlFor="bpm-input" className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
        BPM
      </label>
      <div className="flex items-center gap-2">
        <button
          onClick={decrement}
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-200 text-xl font-bold text-zinc-700 transition-colors hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-600"
          aria-label="Decrease BPM"
        >
          -
        </button>
        <input
          id="bpm-input"
          type="number"
          min={MIN_BPM}
          max={MAX_BPM}
          value={inputValue}
          onChange={handleChange}
          onBlur={handleBlur}
          className="h-14 w-24 rounded-lg border-2 border-zinc-300 bg-white text-center text-3xl font-bold text-zinc-900 focus:border-blue-500 focus:outline-none dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
          aria-label="Beats per minute"
        />
        <button
          onClick={increment}
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-200 text-xl font-bold text-zinc-700 transition-colors hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-600"
          aria-label="Increase BPM"
        >
          +
        </button>
      </div>
      <input
        type="range"
        min={MIN_BPM}
        max={MAX_BPM}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        className="w-full max-w-xs accent-blue-500"
        aria-label="BPM slider"
      />
      <div className="flex w-full max-w-xs justify-between text-xs text-zinc-500 dark:text-zinc-400">
        <span>{MIN_BPM}</span>
        <span>{MAX_BPM}</span>
      </div>
    </div>
  );
}
