import { useSearchParams } from 'react-router-dom';
import { formatDate } from 'pages/utils';
import { validateDate, validateTimeSlot, validateAttendees, validateEquipment } from 'pages/validators';
import { FilterState } from './filterReducer';

export function useInitialFilters(): { initialFilters: FilterState; initError: string | null } {
  const [searchParams] = useSearchParams();

  const fallback: FilterState = {
    date: formatDate(new Date()),
    startTime: '',
    endTime: '',
    attendees: 1,
    equipment: [],
    preferredFloor: null,
  };

  try {
    const date = searchParams.get('date') ?? '';
    const startTime = searchParams.get('startTime') ?? '';
    const endTime = searchParams.get('endTime') ?? '';
    const attendees = Number(searchParams.get('attendees')) || 1;
    const equipment = searchParams.get('equipment')?.split(',').filter(Boolean) ?? [];

    if (date) validateDate(date);
    validateTimeSlot(startTime);
    validateTimeSlot(endTime);
    validateAttendees(attendees);
    validateEquipment(equipment);

    return {
      initialFilters: {
        date: date || formatDate(new Date()),
        startTime,
        endTime,
        attendees,
        equipment,
        preferredFloor: searchParams.get('floor') ? Number(searchParams.get('floor')) : null,
      },
      initError: null,
    };
  } catch (e) {
    return { initialFilters: fallback, initError: e instanceof Error ? e.message : null };
  }
}
