export const ROUTES = {
  HOME: '/',
  BOOKING: '/booking',
} as const;

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

export const TOTAL_MINUTES = (TIME_SLOT_END - TIME_SLOT_START) * 60;
