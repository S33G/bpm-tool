'use client';

import { NoteCalculation } from '@/lib/types';
import { NoteCard } from './NoteCard';

interface NoteGridProps {
  notes: NoteCalculation[];
  showHz?: boolean;
}

export function NoteGrid({ notes, showHz = false }: NoteGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {notes.map((note) => (
        <NoteCard key={note.value} note={note} showHz={showHz} />
      ))}
    </div>
  );
}
