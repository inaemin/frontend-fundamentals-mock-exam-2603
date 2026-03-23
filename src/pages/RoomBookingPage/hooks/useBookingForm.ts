import { useSearchParams } from 'react-router-dom';
import { formatDate } from 'pages/utils';
import { validateDate, validateTimeSlot, validateAttendees, validateEquipment } from '../validators';
import { Room, Reservation } from 'pages/types';

export type BookingFormState = {
  date: string;
  startTime: string;
  endTime: string;
  attendees: number;
  equipment: string[];
  preferredFloor: number | null;
};

export function useBookingForm() {
  const [searchParams, setSearchParams] = useSearchParams();

  const form: BookingFormState = {
    date: searchParams.get('date') ?? formatDate(new Date()),
    startTime: searchParams.get('startTime') ?? '',
    endTime: searchParams.get('endTime') ?? '',
    attendees: Number(searchParams.get('attendees')) || 1,
    equipment: searchParams.get('equipment')?.split(',').filter(Boolean) ?? [],
    preferredFloor: searchParams.get('floor') ? Number(searchParams.get('floor')) : null,
  };

  const setField = <K extends keyof BookingFormState>(field: K, value: BookingFormState[K]) => {
    setSearchParams(
      prev => {
        if (field === 'date') {
          value ? prev.set('date', value as string) : prev.delete('date');
        } else if (field === 'startTime') {
          value ? prev.set('startTime', value as string) : prev.delete('startTime');
        } else if (field === 'endTime') {
          value ? prev.set('endTime', value as string) : prev.delete('endTime');
        } else if (field === 'attendees') {
          (value as number) > 1 ? prev.set('attendees', String(value)) : prev.delete('attendees');
        } else if (field === 'equipment') {
          const eq = value as string[];
          eq.length > 0 ? prev.set('equipment', eq.join(',')) : prev.delete('equipment');
        } else if (field === 'preferredFloor') {
          value !== null ? prev.set('floor', String(value)) : prev.delete('floor');
        }
        return prev;
      },
      { replace: true }
    );
  };

  let validationError: string | null = null;
  try {
    validateDate(form.date);
    validateTimeSlot(form.startTime);
    validateTimeSlot(form.endTime);
    validateAttendees(form.attendees);
    validateEquipment(form.equipment);
  } catch (e) {
    validationError = e instanceof Error ? e.message : null;
  }

  const hasTimeInputs = form.startTime !== '' && form.endTime !== '';
  if (!validationError && hasTimeInputs) {
    if (form.endTime <= form.startTime) {
      validationError = '종료 시간은 시작 시간보다 늦어야 합니다.';
    } else if (form.attendees < 1) {
      validationError = '참석 인원은 1명 이상이어야 합니다.';
    }
  }
  const isFormComplete = hasTimeInputs && !validationError;

  const getAvailableRooms = (rooms: Room[], reservations: Reservation[]) => {
    if (!isFormComplete) return [];
    return rooms
      .filter(room => {
        if (room.capacity < form.attendees) return false;
        if (!form.equipment.every(eq => room.equipment.includes(eq))) return false;
        if (form.preferredFloor !== null && room.floor !== form.preferredFloor) return false;
        const hasConflict = reservations.some(
          r => r.roomId === room.id && r.date === form.date && r.start < form.endTime && r.end > form.startTime
        );
        return !hasConflict;
      })
      .sort((a, b) => {
        if (a.floor !== b.floor) return a.floor - b.floor;
        return a.name.localeCompare(b.name);
      });
  };

  return { form, setField, validationError, isFormComplete, getAvailableRooms };
}
