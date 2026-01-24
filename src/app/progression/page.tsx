'use client';

import { useMemo, useState } from 'react';
import { ToolLayout } from '@/components/layout';
import { ProgressionBuilder, ProgressionPreview } from '@/components/progression';
import { NoteName, buildProgression, PROGRESSION_TEMPLATES } from '@/lib/music';

export default function ProgressionPlannerPage() {
  const [keyRoot, setKeyRoot] = useState<NoteName>('C');
  const [mode, setMode] = useState<'major' | 'minor'>('major');
  const [templateId, setTemplateId] = useState(PROGRESSION_TEMPLATES[0].id);
  const [customNumerals, setCustomNumerals] = useState('');

  const numerals = useMemo(() => {
    if (customNumerals.trim()) {
      return customNumerals.split(/[\s,]+/).filter(Boolean);
    }
    const template = PROGRESSION_TEMPLATES.find((t) => t.id === templateId);
    return template?.numerals || [];
  }, [customNumerals, templateId]);

  const chords = useMemo(() => buildProgression(keyRoot, mode, numerals), [keyRoot, mode, numerals]);

  return (
    <ToolLayout
      title="Progression Planner"
      description="Generate chord progressions from templates or custom roman numerals."
    >
      <section className="mb-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
        <ProgressionBuilder
          keyRoot={keyRoot}
          mode={mode}
          templateId={templateId}
          customNumerals={customNumerals}
          onKeyChange={setKeyRoot}
          onModeChange={setMode}
          onTemplateChange={setTemplateId}
          onCustomChange={setCustomNumerals}
        />
      </section>
      <section className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-800">
        <ProgressionPreview chords={chords} />
      </section>
    </ToolLayout>
  );
}
