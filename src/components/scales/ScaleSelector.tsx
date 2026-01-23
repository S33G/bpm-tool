'use client';

import { Select, SelectGroup } from '@/components/ui';
import { 
  NOTE_NAMES, 
  NoteName, 
  ScaleType,
  getScaleCategories,
  SCALE_DEFINITIONS 
} from '@/lib/music';

interface ScaleSelectorProps {
  root: NoteName;
  scaleType: ScaleType;
  onRootChange: (root: NoteName) => void;
  onScaleTypeChange: (type: ScaleType) => void;
}

const noteOptions = NOTE_NAMES.map(note => ({ value: note, label: note }));

const scaleGroups = getScaleCategories().map(({ category, scales }) => ({
  label: category.charAt(0).toUpperCase() + category.slice(1),
  options: scales.map(s => ({
    value: s,
    label: SCALE_DEFINITIONS[s].name,
  })),
}));

export function ScaleSelector({
  root,
  scaleType,
  onRootChange,
  onScaleTypeChange,
}: ScaleSelectorProps) {
  return (
    <div className="flex flex-wrap gap-4">
      <Select
        label="Root Note"
        value={root}
        onChange={onRootChange}
        options={noteOptions}
      />
      <SelectGroup
        label="Scale Type"
        value={scaleType}
        onChange={onScaleTypeChange}
        groups={scaleGroups}
      />
    </div>
  );
}
