'use client';

import { useState, useEffect } from 'react';

interface ValidatedNumberInputProps {
  value: number;
  onChange: (value: number) => void;
  onBlur?: () => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  placeholder?: string;
  className?: string;
  helperText?: string;
  showError?: boolean;
}

export function ValidatedNumberInput({
  value,
  onChange,
  onBlur,
  min,
  max,
  step = 1,
  label,
  placeholder,
  className = '',
  helperText,
  showError = true,
}: ValidatedNumberInputProps) {
  const [inputValue, setInputValue] = useState(value.toString());
  const [isInvalid, setIsInvalid] = useState(false);

  // Sync input with external value changes
  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  const validate = (numValue: number): boolean => {
    if (min !== undefined && numValue < min) return false;
    if (max !== undefined && numValue > max) return false;
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    const numValue = parseFloat(newValue);
    if (!isNaN(numValue)) {
      setIsInvalid(!validate(numValue));
      if (validate(numValue)) {
        onChange(numValue);
      }
    } else {
      setIsInvalid(newValue !== ''); // Allow empty input
    }
  };

  const handleBlur = () => {
    const numValue = parseFloat(inputValue);
    
    if (isNaN(numValue) || inputValue === '') {
      // Reset to last valid value on blur if empty/invalid
      setInputValue(value.toString());
      setIsInvalid(false);
    } else if (!validate(numValue)) {
      // Clamp to valid range
      let clampedValue = numValue;
      if (min !== undefined && clampedValue < min) {
        clampedValue = min;
      }
      if (max !== undefined && clampedValue > max) {
        clampedValue = max;
      }
      setInputValue(clampedValue.toString());
      onChange(clampedValue);
      setIsInvalid(false);
    } else {
      setIsInvalid(false);
    }

    onBlur?.();
  };

  const errorMessage = (() => {
    if (!isInvalid) return null;
    
    const numValue = parseFloat(inputValue);
    if (isNaN(numValue)) return 'Please enter a valid number';
    if (min !== undefined && numValue < min) return `Must be at least ${min}`;
    if (max !== undefined && numValue > max) return `Must be no more than ${max}`;
    return 'Invalid value';
  })();

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
          {label}
        </label>
      )}
      <input
        type="text"
        inputMode="numeric"
        value={inputValue}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={`h-10 w-full rounded-lg border-2 bg-white px-3 text-sm text-zinc-900 transition-colors focus:outline-none dark:bg-zinc-800 dark:text-white ${
          isInvalid && showError
            ? 'border-red-500 focus:border-red-600 dark:border-red-500'
            : 'border-zinc-300 focus:border-blue-500 dark:border-zinc-600 dark:focus:border-blue-500'
        } ${className}`}
      />
      {isInvalid && showError && errorMessage && (
        <p className="text-xs text-red-600 dark:text-red-400">{errorMessage}</p>
      )}
      {helperText && !isInvalid && (
        <p className="text-xs text-zinc-500 dark:text-zinc-400">{helperText}</p>
      )}
    </div>
  );
}
