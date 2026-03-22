import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Top, Spacing, Button, Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { getRooms, getReservations, getMyReservations, cancelReservation } from 'pages/remotes';
import { ROUTES } from 'pages/constants';
import { formatDate } from 'pages/utils';
import { DateInput } from 'pages/common/DateInput';
import { PageSection } from 'pages/common/PageSection';
import { SectionDivider } from 'pages/common/SectionDivider';
import { TimelineHeader } from './components/TimelineHeader';
import { RoomTimelineRow } from './components/RoomTimelineRow';
import { MessageBanner } from './components/MessageBanner';
import { EmptyReservationList, ReservationList } from './components/MyReservationList';
import { MessageState, MESSAGE_TYPE } from 'pages/types';

export function ReservationStatusPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [date, setDate] = useState(formatDate(new Date()));

  const locationState = location.state as MessageState | null;
  const [message, setMessage] = useState<MessageState | null>(locationState ?? null);

  useEffect(() => {
    if (locationState != null) {
      window.history.replaceState({}, '');
    }
  }, []);

  const { data: rooms = [] } = useQuery({ queryKey: ['rooms'], queryFn: getRooms });
  const { data: reservations = [] } = useQuery({
    queryKey: ['reservations', date],
    queryFn: () => getReservations(date),
    enabled: !!date,
  });
  const { data: myReservationList = [] } = useQuery({ queryKey: ['myReservations'], queryFn: getMyReservations });

  const cancelMutation = useMutation({
    mutationFn: (id: string) => cancelReservation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      queryClient.invalidateQueries({ queryKey: ['myReservations'] });
    },
  });

  const handleCancel = async (id: string) => {
    try {
      await cancelMutation.mutateAsync(id);
      setMessage({ type: MESSAGE_TYPE.SUCCESS, text: '예약이 취소되었습니다.' });
    } catch {
      setMessage({ type: MESSAGE_TYPE.ERROR, text: '취소에 실패했습니다.' });
    }
  };

  const [activeReservation, setActiveReservation] = useState<string | null>(null);

  const getRoomName = (roomId: string) =>
    rooms.find((r: { id: string; name: string }) => r.id === roomId)?.name ?? roomId;

  return (
    <div
      css={css`
        background: ${colors.white};
        padding-bottom: 40px;
      `}
    >
      <Top.Top03
        css={css`
          padding-left: 24px;
          padding-right: 24px;
        `}
      >
        회의실 예약
      </Top.Top03>

      <Spacing size={24} />

      {/* 날짜 선택 */}
      <PageSection title="날짜 선택">
        <DateInput value={date} onChange={setDate} />
      </PageSection>

      <SectionDivider />

      {/* 예약 현황 타임라인 */}
      <PageSection title="예약 현황">
        <div
          css={css`
            background: ${colors.grey50};
            border-radius: 14px;
            padding: 16px;
          `}
        >
          <TimelineHeader />
          {rooms.map((room: { id: string; name: string }, index: number) => {
            const roomReservations = reservations.filter((r: { roomId: string }) => r.roomId === room.id);
            return (
              <RoomTimelineRow
                key={room.id}
                room={room}
                reservations={roomReservations}
                index={index}
                activeReservation={activeReservation}
                onActiveReservationChange={setActiveReservation}
              />
            );
          })}
        </div>
      </PageSection>

      <SectionDivider />

      {/* 메시지 배너 */}
      {message && <MessageBanner message={message} />}

      {/* 내 예약 목록 */}
      <PageSection
        title={
          <>
            <Text typography="t5" fontWeight="bold" color={colors.grey900}>
              내 예약
            </Text>
            {myReservationList.length > 0 && (
              <Text typography="t7" fontWeight="medium" color={colors.grey500}>
                {myReservationList.length}건
              </Text>
            )}
          </>
        }
      >
        {myReservationList.length === 0 ? (
          <EmptyReservationList />
        ) : (
          <ReservationList reservations={myReservationList} getRoomName={getRoomName} onCancel={handleCancel} />
        )}
      </PageSection>

      <SectionDivider />

      {/* 예약하기 버튼 */}
      <div
        css={css`
          padding: 0 24px;
        `}
      >
        <Button display="full" onClick={() => navigate(ROUTES.BOOKING)}>
          예약하기
        </Button>
      </div>
      <Spacing size={24} />
    </div>
  );
}
