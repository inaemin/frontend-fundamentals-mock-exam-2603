import { TIME_SLOTS, ALL_EQUIPMENT } from 'pages/constants';
import { formatDate } from 'pages/utils';

export function validateDate(date: string): string {
  const today = formatDate(new Date());
  if (!date || date < today) return today;
  return date;
}

export function validateTimeSlot(time: string): string {
  if (TIME_SLOTS.includes(time)) return time;
  return '';
}

export function validateAttendees(attendees: number): number {
  if (attendees >= 1) return attendees;
  return 1;
}

export function validateEquipment(equipment: string[]): string[] {
  return equipment.filter(eq => ALL_EQUIPMENT.includes(eq));
}

export function validateFloor(floor: number | null, validFloors: number[]): number | null {
  if (floor === null) return null;
  if (validFloors.includes(floor)) return floor;
  return null;
}
