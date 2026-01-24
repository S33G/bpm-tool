'use client';

import { useState, useEffect } from 'react';
import { SetlistItem } from '@/lib/setlist';
import { NOTE_NAMES } from '@/lib/music';

interface SongEditorProps {
  item?: SetlistItem;
  onSave: (item: SetlistItem) => void;
  onCancel: () => void;
}

export function SongEditor({ item, onSave, onCancel }: SongEditorProps) {
  const [title, setTitle] = useState(item?.title || '');
  const [bpm, setBpm] = useState(item?.bpm?.toString() || '');
  const [key, setKey] = useState(item?.key || '');
  const [timeSignature, setTimeSignature] = useState(item?.timeSignature || '');
  const [notes, setNotes] = useState(item?.notes || '');
  const [section, setSection] = useState(item?.section || '');
  const [tags, setTags] = useState(item?.tags?.join(', ') || '');
  
  const handleSave = () => {
    if (!title.trim()) return;
    
    onSave({
      id: item?.id || crypto.randomUUID(),
      title: title.trim(),
      bpm: bpm ? parseInt(bpm) : undefined,
      key: key || undefined,
      timeSignature: timeSignature || undefined,
      notes: notes.trim() || undefined,
      section: section.trim() || undefined,
      tags: tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
    });
  };
  
  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800">
      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
          Song Title *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter song title"
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-zinc-600 dark:bg-zinc-900"
          autoFocus
        />
      </div>
      
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
            BPM
          </label>
          <input
            type="number"
            value={bpm}
            onChange={(e) => setBpm(e.target.value)}
            placeholder="120"
            min={20}
            max={300}
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-zinc-600 dark:bg-zinc-900"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
            Key
          </label>
          <select
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-zinc-600 dark:bg-zinc-900"
          >
            <option value="">Select key</option>
            {NOTE_NAMES.map(note => (
              <option key={`${note}-major`} value={`${note} Major`}>{note} Major</option>
            ))}
            {NOTE_NAMES.map(note => (
              <option key={`${note}-minor`} value={`${note} Minor`}>{note} Minor</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
            Time Signature
          </label>
          <select
            value={timeSignature}
            onChange={(e) => setTimeSignature(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-zinc-600 dark:bg-zinc-900"
          >
            <option value="">Select time</option>
            <option value="4/4">4/4</option>
            <option value="3/4">3/4</option>
            <option value="6/8">6/8</option>
            <option value="2/4">2/4</option>
            <option value="5/4">5/4</option>
            <option value="7/8">7/8</option>
          </select>
        </div>
      </div>
      
      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
          Notes
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any notes about this song..."
          rows={2}
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-zinc-600 dark:bg-zinc-900"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
            Section
          </label>
          <input
            type="text"
            value={section}
            onChange={(e) => setSection(e.target.value)}
            placeholder="Intro, Verse, Chorus"
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-zinc-600 dark:bg-zinc-900"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
            Tags
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="acoustic, fast, opener"
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-zinc-600 dark:bg-zinc-900"
          />
        </div>
      </div>
      
      <div className="flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-700"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={!title.trim()}
          className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-50"
        >
          {item ? 'Update' : 'Add Song'}
        </button>
      </div>
    </div>
  );
}
