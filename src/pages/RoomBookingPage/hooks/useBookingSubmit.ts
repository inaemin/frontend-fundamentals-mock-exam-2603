import { useQueryClient, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { createReservation } from 'pages/remotes';
import { CreateReservationInput } from 'pages/types';
import { BookingFormState } from './useBookingForm';

type UseBookingSubmitOptions = {
  onSuccess: () => void;
  onError: (message: string) => void;
};

export function useBookingSubmit(form: BookingFormState, { onSuccess, onError }: UseBookingSubmitOptions) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: CreateReservationInput) => createReservation(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reservations', variables.date] });
      queryClient.invalidateQueries({ queryKey: ['myReservations'] });
    },
  });

  const submit = async (selectedRoomId: string | null) => {
    if (!selectedRoomId) {
      onError('회의실을 선택해주세요.');
      return;
    }
    if (!form.startTime || !form.endTime) {
      onError('시작 시간과 종료 시간을 선택해주세요.');
      return;
    }

    try {
      const result = await mutation.mutateAsync({
        roomId: selectedRoomId,
        date: form.date,
        start: form.startTime,
        end: form.endTime,
        attendees: form.attendees,
        equipment: form.equipment,
      });

      if ('ok' in result && result.ok) {
        onSuccess();
        return;
      }

      const errResult = result as { message?: string };
      onError(errResult.message ?? '예약에 실패했습니다.');
    } catch (err: unknown) {
      let serverMessage = '예약에 실패했습니다.';
      if (axios.isAxiosError(err)) {
        const data = err.response?.data as { message?: string } | undefined;
        serverMessage = data?.message ?? serverMessage;
      }
      onError(serverMessage);
    }
  };

  return { submit, isLoading: mutation.isLoading };
}
