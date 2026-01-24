export interface SetlistItem {
  id: string;
  title: string;
  bpm?: number;
  key?: string;
  timeSignature?: string;
  notes?: string;
  section?: string;
  tags?: string[];
  chords?: string[];
}

export interface Setlist {
  id: string;
  name: string;
  items: SetlistItem[];
  createdAt: number;
  updatedAt: number;
}

export function createSetlistItem(title: string): SetlistItem {
  return {
    id: crypto.randomUUID(),
    title,
  };
}

export function createSetlist(name: string): Setlist {
  return {
    id: crypto.randomUUID(),
    name,
    items: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}
