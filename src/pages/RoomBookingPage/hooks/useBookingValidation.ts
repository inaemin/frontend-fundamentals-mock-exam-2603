interface BookingFilter {
  startTime: string;
  endTime: string;
  attendees: number;
}

export function useBookingValidation({ startTime, endTime, attendees }: BookingFilter) {
  const hasTimeInputs = startTime !== '' && endTime !== '';

  let validationError: string | null = null;
  if (hasTimeInputs) {
    if (endTime <= startTime) {
      validationError = '종료 시간은 시작 시간보다 늦어야 합니다.';
    } else if (attendees < 1) {
      validationError = '참석 인원은 1명 이상이어야 합니다.';
    }
  }

  return { validationError, isFilterComplete: hasTimeInputs && !validationError };
}
