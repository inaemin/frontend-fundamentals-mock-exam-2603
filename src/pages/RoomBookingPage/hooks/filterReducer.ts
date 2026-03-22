export type FilterState = {
  date: string;
  startTime: string;
  endTime: string;
  attendees: number;
  equipment: string[];
  preferredFloor: number | null;
};

export type FilterAction = { type: 'SET'; field: keyof FilterState; value: FilterState[keyof FilterState] };

export function filterReducer(state: FilterState, action: FilterAction): FilterState {
  return { ...state, [action.field]: action.value };
}
