import { TIME_SLOT_START } from 'pages/constants';

export function timeToOffsetMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return (h - TIME_SLOT_START) * 60 + m;
}

export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
