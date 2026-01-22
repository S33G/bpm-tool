'use client';

import { useState } from 'react';
import { Bookmark } from '@/lib/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { STORAGE_KEYS } from '@/lib/constants';
import { useToast } from '@/context/ToastContext';

interface BookmarkBarProps {
  currentBpm: number;
  onSelectBpm: (bpm: number) => void;
}

export function BookmarkBar({ currentBpm, onSelectBpm }: BookmarkBarProps) {
  const [bookmarks, setBookmarks] = useLocalStorage<Bookmark[]>(STORAGE_KEYS.BOOKMARKS, []);
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const { showToast } = useToast();

  const handleAddBookmark = () => {
    // Check if BPM already bookmarked
    if (bookmarks.some((b) => b.bpm === currentBpm)) {
      showToast(`${currentBpm} BPM is already bookmarked`, 'info');
      return;
    }

    const newBookmark: Bookmark = {
      id: Math.random().toString(36).substring(2, 9),
      bpm: currentBpm,
      name: newName || undefined,
      createdAt: Date.now(),
    };

    setBookmarks([...bookmarks, newBookmark]);
    setNewName('');
    setIsAdding(false);
    showToast(`Bookmarked ${currentBpm} BPM`);
  };

  const handleRemoveBookmark = (id: string) => {
    setBookmarks(bookmarks.filter((b) => b.id !== id));
    showToast('Bookmark removed');
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Bookmarks:</span>

      {bookmarks.length === 0 && !isAdding && (
        <span className="text-sm text-zinc-400 dark:text-zinc-500">None saved</span>
      )}

      {bookmarks.map((bookmark) => (
        <div key={bookmark.id} className="group relative">
          <button
            onClick={() => onSelectBpm(bookmark.bpm)}
            className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
              bookmark.bpm === currentBpm
                ? 'bg-blue-500 text-white'
                : 'bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-600'
            }`}
          >
            {bookmark.name || `${bookmark.bpm} BPM`}
          </button>
          <button
            onClick={() => handleRemoveBookmark(bookmark.id)}
            className="absolute -right-1 -top-1 hidden h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white group-hover:flex"
            aria-label={`Remove ${bookmark.bpm} BPM bookmark`}
          >
            x
          </button>
        </div>
      ))}

      {isAdding ? (
        <div className="flex items-center gap-1">
          <input
            type="text"
            placeholder="Name (optional)"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddBookmark()}
            className="w-24 rounded border border-zinc-300 px-2 py-1 text-sm dark:border-zinc-600 dark:bg-zinc-700"
            autoFocus
          />
          <button
            onClick={handleAddBookmark}
            className="rounded bg-green-500 px-2 py-1 text-xs text-white hover:bg-green-600"
          >
            Save
          </button>
          <button
            onClick={() => {
              setIsAdding(false);
              setNewName('');
            }}
            className="rounded bg-zinc-300 px-2 py-1 text-xs text-zinc-700 hover:bg-zinc-400 dark:bg-zinc-600 dark:text-zinc-200"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-1 rounded-full bg-zinc-200 px-3 py-1 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-600"
        >
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add
        </button>
      )}
    </div>
  );
}
