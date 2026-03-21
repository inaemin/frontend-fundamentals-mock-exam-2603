export const EQUIPMENT_LABELS: Record<string, string> = {
  tv: 'TV',
  whiteboard: '화이트보드',
  video: '화상장비',
  speaker: '스피커',
};

export const ALL_EQUIPMENT = Object.keys(EQUIPMENT_LABELS);

export const TIME_SLOT_START = 9;
export const TIME_SLOT_END = 20;

export const TIME_SLOTS: string[] = [];
for (let h = TIME_SLOT_START; h <= TIME_SLOT_END; h++) {
  TIME_SLOTS.push(`${String(h).padStart(2, '0')}:00`);
  if (h < TIME_SLOT_END) {
    TIME_SLOTS.push(`${String(h).padStart(2, '0')}:30`);
  }
}

export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
