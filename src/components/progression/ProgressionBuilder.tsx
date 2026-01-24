'use client';

import { Select } from '@/components/ui';
import { NoteName, NOTE_NAMES, ProgressionTemplate, PROGRESSION_TEMPLATES } from '@/lib/music';

interface ProgressionBuilderProps {
  keyRoot: NoteName;
  mode: 'major' | 'minor';
  templateId: string;
  customNumerals: string;
  onKeyChange: (key: NoteName) => void;
  onModeChange: (mode: 'major' | 'minor') => void;
  onTemplateChange: (id: string) => void;
  onCustomChange: (value: string) => void;
}

const keyOptions = NOTE_NAMES.map((note) => ({ value: note, label: note }));

export function ProgressionBuilder({
  keyRoot,
  mode,
  templateId,
  customNumerals,
  onKeyChange,
  onModeChange,
  onTemplateChange,
  onCustomChange,
}: ProgressionBuilderProps) {
  const templateOptions = PROGRESSION_TEMPLATES.map((template) => ({
    value: template.id,
    label: `${template.name} (${template.mode})`,
  }));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <Select label="Key" value={keyRoot} onChange={onKeyChange} options={keyOptions} />
        <Select
          label="Mode"
          value={mode}
          onChange={(v) => onModeChange(v as 'major' | 'minor')}
          options={[
            { value: 'major', label: 'Major' },
            { value: 'minor', label: 'Minor' },
          ]}
        />
        <Select label="Template" value={templateId} onChange={onTemplateChange} options={templateOptions} />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
          Custom numerals (override template)
        </label>
        <input
          type="text"
          value={customNumerals}
          onChange={(e) => onCustomChange(e.target.value)}
          placeholder="I vi IV V"
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-zinc-600 dark:bg-zinc-800"
        />
      </div>
    </div>
  );
}
