import { Setlist } from './types';

export function exportSetlistToJson(setlist: Setlist): string {
  return JSON.stringify(setlist, null, 2);
}

export function downloadSetlistJson(setlist: Setlist): void {
  const json = exportSetlistToJson(setlist);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `${setlist.name.replace(/\s+/g, '_')}_setlist.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function importSetlistFromJson(json: string): Setlist | null {
  try {
    const parsed = JSON.parse(json);
    if (parsed.id && parsed.name && Array.isArray(parsed.items)) {
      return {
        ...parsed,
        id: crypto.randomUUID(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
    }
    return null;
  } catch {
    return null;
  }
}

export function printSetlist(setlist: Setlist, compact: boolean = false): void {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${setlist.name} - Setlist</title>
      <style>
        body {
          font-family: system-ui, -apple-system, sans-serif;
          max-width: 800px;
          margin: 0 auto;
          padding: ${compact ? '10px' : '20px'};
        }
        h1 {
          border-bottom: 2px solid #333;
          padding-bottom: ${compact ? '6px' : '10px'};
        }
        .song {
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: ${compact ? '8px' : '15px'};
          margin-bottom: ${compact ? '8px' : '15px'};
        }
        .song-title {
          font-size: ${compact ? '1em' : '1.2em'};
          font-weight: bold;
          margin-bottom: ${compact ? '4px' : '8px'};
        }
        .song-meta {
          display: flex;
          gap: 20px;
          color: #666;
          font-size: 0.9em;
        }
        .song-notes {
          margin-top: ${compact ? '4px' : '10px'};
          font-style: italic;
          color: #555;
        }
        .song-number {
          color: #999;
          font-size: 0.9em;
        }
        .section {
          margin-top: ${compact ? '10px' : '20px'};
          margin-bottom: ${compact ? '6px' : '10px'};
          font-weight: bold;
          text-transform: uppercase;
          color: #444;
        }
        @media print {
          .song { break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <h1>${setlist.name}</h1>
      ${setlist.items.map((item, index) => `
        ${item.section ? `<div class="section">${item.section}</div>` : ''}
        <div class="song">
          <div class="song-title">
            <span class="song-number">${index + 1}.</span> ${item.title}
          </div>
          <div class="song-meta">
            ${item.bpm ? `<span>BPM: ${item.bpm}</span>` : ''}
            ${item.key ? `<span>Key: ${item.key}</span>` : ''}
            ${item.timeSignature ? `<span>Time: ${item.timeSignature}</span>` : ''}
            ${item.tags && item.tags.length > 0 ? `<span>Tags: ${item.tags.join(', ')}</span>` : ''}
          </div>
          ${item.notes ? `<div class="song-notes">${item.notes}</div>` : ''}
        </div>
      `).join('')}
    </body>
    </html>
  `;
  
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.print();
}
