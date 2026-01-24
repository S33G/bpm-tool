'use client';

interface MidiUploaderProps {
  onLoad: (data: ArrayBuffer) => void;
}

export function MidiUploader({ onLoad }: MidiUploaderProps) {
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const buffer = await file.arrayBuffer();
    onLoad(buffer);
  };

  return (
    <label className="flex w-full cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-zinc-300 p-6 text-center text-sm text-zinc-500 hover:border-blue-400 hover:text-blue-500 dark:border-zinc-600 dark:hover:border-blue-500">
      <input type="file" accept=".mid,.midi" className="hidden" onChange={handleFileChange} />
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
      Upload MIDI file
    </label>
  );
}
