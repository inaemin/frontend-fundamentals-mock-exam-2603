import { TIME_SLOTS, ALL_EQUIPMENT } from 'pages/constants';
import { formatDate } from 'pages/utils';

export function validateDate(date: string): void {
  const today = formatDate(new Date());
  if (!date || date < today) throw new Error('날짜는 오늘 이후여야 합니다.');
}

export function validateTimeSlot(time: string): void {
  if (time && !TIME_SLOTS.includes(time)) throw new Error(`유효하지 않은 시간입니다: ${time}`);
}

export function validateAttendees(attendees: number): void {
  if (attendees < 1) throw new Error('참석 인원은 1명 이상이어야 합니다.');
}

export function validateEquipment(equipment: string[]): void {
  const invalid = equipment.filter(eq => !ALL_EQUIPMENT.includes(eq));
  if (invalid.length > 0) throw new Error(`유효하지 않은 장비입니다: ${invalid.join(', ')}`);
}

export function validateFloor(floor: number | null, validFloors: number[]): void {
  if (floor !== null && !validFloors.includes(floor)) throw new Error(`유효하지 않은 층입니다: ${floor}`);
}
