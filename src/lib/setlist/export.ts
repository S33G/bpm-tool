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

export function printSetlist(setlist: Setlist): void {
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
          padding: 20px;
        }
        h1 {
          border-bottom: 2px solid #333;
          padding-bottom: 10px;
        }
        .song {
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 15px;
          margin-bottom: 15px;
        }
        .song-title {
          font-size: 1.2em;
          font-weight: bold;
          margin-bottom: 8px;
        }
        .song-meta {
          display: flex;
          gap: 20px;
          color: #666;
          font-size: 0.9em;
        }
        .song-notes {
          margin-top: 10px;
          font-style: italic;
          color: #555;
        }
        .song-number {
          color: #999;
          font-size: 0.9em;
        }
        @media print {
          .song { break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <h1>${setlist.name}</h1>
      ${setlist.items.map((item, index) => `
        <div class="song">
          <div class="song-title">
            <span class="song-number">${index + 1}.</span> ${item.title}
          </div>
          <div class="song-meta">
            ${item.bpm ? `<span>BPM: ${item.bpm}</span>` : ''}
            ${item.key ? `<span>Key: ${item.key}</span>` : ''}
            ${item.timeSignature ? `<span>Time: ${item.timeSignature}</span>` : ''}
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
