'use client';

import { useState, useEffect, useCallback } from 'react';
import { ToolLayout } from '@/components/layout';
import { SongCard, SongEditor } from '@/components/setlist';
import { 
  Setlist, 
  SetlistItem,
  createSetlist,
  loadSetlists,
  saveSetlists,
  downloadSetlistJson,
  printSetlist,
  importSetlistFromJson,
} from '@/lib/setlist';

export default function SetlistBuilderPage() {
  const [setlists, setSetlists] = useState<Setlist[]>([]);
  const [activeSetlistId, setActiveSetlistId] = useState<string | null>(null);
  const [isAddingSong, setIsAddingSong] = useState(false);
  const [editingItem, setEditingItem] = useState<SetlistItem | null>(null);
  const [newSetlistName, setNewSetlistName] = useState('');
  const [isCreatingSetlist, setIsCreatingSetlist] = useState(false);
  
  useEffect(() => {
    const loaded = loadSetlists();
    setSetlists(loaded);
    if (loaded.length > 0) {
      setActiveSetlistId(loaded[0].id);
    }
  }, []);
  
  const activeSetlist = setlists.find(s => s.id === activeSetlistId);
  
  const updateSetlists = useCallback((newSetlists: Setlist[]) => {
    setSetlists(newSetlists);
    saveSetlists(newSetlists);
  }, []);
  
  const handleCreateSetlist = () => {
    if (!newSetlistName.trim()) return;
    
    const newSetlist = createSetlist(newSetlistName.trim());
    updateSetlists([...setlists, newSetlist]);
    setActiveSetlistId(newSetlist.id);
    setNewSetlistName('');
    setIsCreatingSetlist(false);
  };
  
  const handleDeleteSetlist = (id: string) => {
    if (!confirm('Delete this setlist?')) return;
    
    const newSetlists = setlists.filter(s => s.id !== id);
    updateSetlists(newSetlists);
    
    if (activeSetlistId === id) {
      setActiveSetlistId(newSetlists.length > 0 ? newSetlists[0].id : null);
    }
  };
  
  const handleAddSong = (item: SetlistItem) => {
    if (!activeSetlist) return;
    
    const updated = {
      ...activeSetlist,
      items: [...activeSetlist.items, item],
      updatedAt: Date.now(),
    };
    
    updateSetlists(setlists.map(s => s.id === updated.id ? updated : s));
    setIsAddingSong(false);
  };
  
  const handleUpdateSong = (item: SetlistItem) => {
    if (!activeSetlist) return;
    
    const updated = {
      ...activeSetlist,
      items: activeSetlist.items.map(i => i.id === item.id ? item : i),
      updatedAt: Date.now(),
    };
    
    updateSetlists(setlists.map(s => s.id === updated.id ? updated : s));
    setEditingItem(null);
  };
  
  const handleDeleteSong = (itemId: string) => {
    if (!activeSetlist) return;
    
    const updated = {
      ...activeSetlist,
      items: activeSetlist.items.filter(i => i.id !== itemId),
      updatedAt: Date.now(),
    };
    
    updateSetlists(setlists.map(s => s.id === updated.id ? updated : s));
  };
  
  const handleMoveSong = (index: number, direction: 'up' | 'down') => {
    if (!activeSetlist) return;
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= activeSetlist.items.length) return;
    
    const items = [...activeSetlist.items];
    [items[index], items[newIndex]] = [items[newIndex], items[index]];
    
    const updated = {
      ...activeSetlist,
      items,
      updatedAt: Date.now(),
    };
    
    updateSetlists(setlists.map(s => s.id === updated.id ? updated : s));
  };
  
  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      const text = await file.text();
      const imported = importSetlistFromJson(text);
      
      if (imported) {
        updateSetlists([...setlists, imported]);
        setActiveSetlistId(imported.id);
      } else {
        alert('Invalid setlist file');
      }
    };
    input.click();
  };
  
  return (
    <ToolLayout
      title="Setlist Builder"
      description="Organize songs with BPM, key, and notes. Export to PDF or JSON."
    >
      <section className="mb-6 flex flex-wrap items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
        <div className="flex flex-1 flex-wrap items-center gap-2">
          {setlists.map(setlist => (
            <button
              key={setlist.id}
              onClick={() => setActiveSetlistId(setlist.id)}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                activeSetlistId === setlist.id
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-700'
              }`}
            >
              {setlist.name}
              <span className="text-xs opacity-60">({setlist.items.length})</span>
            </button>
          ))}
          
          {isCreatingSetlist ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newSetlistName}
                onChange={(e) => setNewSetlistName(e.target.value)}
                placeholder="Setlist name"
                className="h-9 w-40 rounded-lg border border-zinc-300 bg-white px-3 text-sm focus:border-blue-500 focus:outline-none dark:border-zinc-600 dark:bg-zinc-900"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleCreateSetlist()}
              />
              <button
                onClick={handleCreateSetlist}
                className="rounded-lg bg-blue-500 px-3 py-2 text-sm font-medium text-white hover:bg-blue-600"
              >
                Create
              </button>
              <button
                onClick={() => setIsCreatingSetlist(false)}
                className="text-sm text-zinc-500 hover:text-zinc-700"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsCreatingSetlist(true)}
              className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-700"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Setlist
            </button>
          )}
        </div>
        
        <button
          onClick={handleImport}
          className="text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400"
        >
          Import JSON
        </button>
      </section>
      
      {activeSetlist ? (
        <>
          <section className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
              {activeSetlist.name}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => printSetlist(activeSetlist)}
                className="flex items-center gap-2 rounded-lg bg-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-600"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print
              </button>
              <button
                onClick={() => printSetlist(activeSetlist, true)}
                className="flex items-center gap-2 rounded-lg bg-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-600"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h10M7 16h6" />
                </svg>
                Print Compact
              </button>
              <button
                onClick={() => downloadSetlistJson(activeSetlist)}
                className="flex items-center gap-2 rounded-lg bg-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-600"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export JSON
              </button>
              <button
                onClick={() => handleDeleteSetlist(activeSetlist.id)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                Delete
              </button>
            </div>
          </section>
          
          <section className="mb-6 space-y-3">
            {activeSetlist.items.map((item, index) => (
              <div key={item.id}>
                {item.section && (index === 0 || activeSetlist.items[index - 1].section !== item.section) && (
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                    {item.section}
                  </div>
                )}
                {editingItem?.id === item.id ? (
                  <SongEditor
                    item={item}
                    onSave={handleUpdateSong}
                    onCancel={() => setEditingItem(null)}
                  />
                ) : (
                  <SongCard
                    item={item}
                    index={index}
                    onEdit={() => setEditingItem(item)}
                    onDelete={() => handleDeleteSong(item.id)}
                    onMoveUp={() => handleMoveSong(index, 'up')}
                    onMoveDown={() => handleMoveSong(index, 'down')}
                    isFirst={index === 0}
                    isLast={index === activeSetlist.items.length - 1}
                  />
                )}
              </div>
            ))}
            
            {activeSetlist.items.length === 0 && !isAddingSong && (
              <div className="rounded-lg border-2 border-dashed border-zinc-200 p-8 text-center dark:border-zinc-700">
                <p className="text-zinc-500">No songs in this setlist yet</p>
              </div>
            )}
          </section>
          
          {isAddingSong ? (
            <SongEditor
              onSave={handleAddSong}
              onCancel={() => setIsAddingSong(false)}
            />
          ) : (
            <button
              onClick={() => setIsAddingSong(true)}
              className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-zinc-300 py-4 text-zinc-500 transition-colors hover:border-blue-400 hover:text-blue-500 dark:border-zinc-600 dark:hover:border-blue-500"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Song
            </button>
          )}
        </>
      ) : (
        <div className="rounded-lg border-2 border-dashed border-zinc-200 p-12 text-center dark:border-zinc-700">
          <p className="mb-4 text-zinc-500">No setlists yet</p>
          <button
            onClick={() => setIsCreatingSetlist(true)}
            className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
          >
            Create Your First Setlist
          </button>
        </div>
      )}
    </ToolLayout>
  );
}
