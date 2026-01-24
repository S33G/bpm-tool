'use client';

import { useRef, useEffect, useState } from 'react';
import { PianoKey } from './PianoKey';
import { NoteName, NOTE_NAMES, midiToNoteName, midiToNoteWithOctave } from '@/lib/music';

interface PianoProps {
  startMidi?: number;
  endMidi?: number;
  highlightedMidi?: number[];
  highlightedNotes?: NoteName[];
  highlightColor?: string;
  highlightMap?: Record<NoteName, string>;
  labelMap?: Record<NoteName, string>;
  onKeyClick?: (midi: number) => void;
  showLabels?: boolean;
}

export function Piano({
  startMidi = 36,
  endMidi = 84,
  highlightedMidi = [],
  highlightedNotes = [],
  highlightColor = 'blue',
  highlightMap,
  labelMap,
  onKeyClick,
  showLabels = true,
}: PianoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);
  
  const isBlackKey = (midi: number): boolean => {
    const note = midiToNoteName(midi);
    return note.includes('#');
  };
  
  const whiteKeys: number[] = [];
  const blackKeys: number[] = [];
  
  for (let midi = startMidi; midi <= endMidi; midi++) {
    if (isBlackKey(midi)) {
      blackKeys.push(midi);
    } else {
      whiteKeys.push(midi);
    }
  }
  
  const whiteKeyWidth = Math.max(20, Math.min(40, containerWidth / whiteKeys.length));
  const blackKeyWidth = whiteKeyWidth * 0.6;
  const whiteKeyHeight = whiteKeyWidth * 4;
  const blackKeyHeight = whiteKeyHeight * 0.6;
  
  const totalWidth = whiteKeys.length * whiteKeyWidth;
  
  const getWhiteKeyIndex = (midi: number): number => {
    let count = 0;
    for (let m = startMidi; m < midi; m++) {
      if (!isBlackKey(m)) count++;
    }
    return count;
  };
  
  const getBlackKeyPosition = (midi: number): number => {
    const prevWhiteMidi = midi - 1;
    const whiteIndex = getWhiteKeyIndex(prevWhiteMidi);
    return (whiteIndex + 1) * whiteKeyWidth - blackKeyWidth / 2;
  };
  
  const isHighlighted = (midi: number): boolean => {
    if (highlightedMidi.includes(midi)) return true;
    const noteName = midiToNoteName(midi);
    return highlightedNotes.includes(noteName);
  };
  
  return (
    <div ref={containerRef} className="overflow-x-auto">
      <svg
        width={totalWidth}
        height={whiteKeyHeight + (showLabels ? 20 : 0)}
        viewBox={`0 0 ${totalWidth} ${whiteKeyHeight + (showLabels ? 20 : 0)}`}
        className="mx-auto"
      >
        {whiteKeys.map((midi, index) => (
          <PianoKey
            key={midi}
            midi={midi}
            x={index * whiteKeyWidth}
            y={0}
            width={whiteKeyWidth - 1}
            height={whiteKeyHeight}
            isBlack={false}
            isHighlighted={isHighlighted(midi)}
            highlightColor={highlightMap?.[midiToNoteName(midi)] || highlightColor}
            onClick={onKeyClick}
            showLabel={showLabels}
            labelOverride={labelMap?.[midiToNoteName(midi)]}
          />
        ))}
        
        {blackKeys.map((midi) => (
          <PianoKey
            key={midi}
            midi={midi}
            x={getBlackKeyPosition(midi)}
            y={0}
            width={blackKeyWidth}
            height={blackKeyHeight}
            isBlack={true}
            isHighlighted={isHighlighted(midi)}
            highlightColor={highlightMap?.[midiToNoteName(midi)] || highlightColor}
            onClick={onKeyClick}
            showLabel={false}
            labelOverride={labelMap?.[midiToNoteName(midi)]}
          />
        ))}
      </svg>
    </div>
  );
}
