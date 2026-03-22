import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Top, Spacing, Border, Button, Text, ListRow } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { getRooms, getReservations, getMyReservations, cancelReservation } from 'pages/remotes';
import { EQUIPMENT_LABELS, ROUTES } from 'pages/constants';
import { formatDate } from 'pages/utils';
import { DateInput } from 'pages/components/DateInput';
import { TimelineHeader } from 'pages/components/TimelineHeader';
import { RoomTimelineRow } from 'pages/components/RoomTimelineRow';
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
      <div
        css={css`
          padding: 0 24px;
        `}
      >
        <Text typography="t5" fontWeight="bold" color={colors.grey900}>
          날짜 선택
        </Text>
        <Spacing size={16} />
        <div
          css={css`
            display: flex;
            flex-direction: column;
            gap: 6px;
          `}
        >
          <DateInput value={date} onChange={setDate} />
        </div>
      </div>

      <Spacing size={24} />
      <Border size={8} />
      <Spacing size={24} />

      {/* 예약 현황 타임라인 */}
      <div
        css={css`
          padding: 0 24px;
        `}
      >
        <Text typography="t5" fontWeight="bold" color={colors.grey900}>
          예약 현황
        </Text>
        <Spacing size={16} />

        <div
          css={css`
            background: ${colors.grey50};
            border-radius: 14px;
            padding: 16px;
          `}
        >
          <TimelineHeader />

          {/* 회의실별 타임라인 */}
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
      </div>

      <Spacing size={24} />
      <Border size={8} />
      <Spacing size={24} />

      {/* 메시지 배너 */}
      {message && (
        <div
          css={css`
            padding: 0 24px;
          `}
        >
          <div
            css={css`
              padding: 10px 14px;
              border-radius: 10px;
              background: ${message.type === 'success' ? colors.blue50 : colors.red50};
              display: flex;
              align-items: center;
              gap: 8px;
            `}
          >
            <Text
              typography="t7"
              fontWeight="medium"
              color={message.type === 'success' ? colors.blue600 : colors.red500}
            >
              {message.text}
            </Text>
          </div>
          <Spacing size={12} />
        </div>
      )}

      {/* 내 예약 목록 */}
      <div
        css={css`
          padding: 0 24px;
        `}
      >
        <div
          css={css`
            display: flex;
            align-items: baseline;
            gap: 6px;
          `}
        >
          <Text typography="t5" fontWeight="bold" color={colors.grey900}>
            내 예약
          </Text>
          {myReservationList.length > 0 && (
            <Text typography="t7" fontWeight="medium" color={colors.grey500}>
              {myReservationList.length}건
            </Text>
          )}
        </div>
        <Spacing size={16} />

        {myReservationList.length === 0 ? (
          <div
            css={css`
              padding: 40px 0;
              text-align: center;
              background: ${colors.grey50};
              border-radius: 14px;
            `}
          >
            <Text typography="t6" color={colors.grey500}>
              예약 내역이 없습니다.
            </Text>
          </div>
        ) : (
          <div
            css={css`
              display: flex;
              flex-direction: column;
              gap: 10px;
            `}
          >
            {myReservationList.map(
              (res: {
                id: string;
                roomId: string;
                date: string;
                start: string;
                end: string;
                attendees: number;
                equipment: string[];
              }) => (
                <div
                  key={res.id}
                  css={css`
                    padding: 14px 16px;
                    border-radius: 14px;
                    background: ${colors.grey50};
                    border: 1px solid ${colors.grey200};
                  `}
                >
                  <ListRow
                    contents={
                      <ListRow.Text2Rows
                        top={getRoomName(res.roomId)}
                        topProps={{ typography: 't6', fontWeight: 'bold', color: colors.grey900 }}
                        bottom={`${res.date} ${res.start}~${res.end} · ${res.attendees}명 · ${
                          res.equipment.map((e: string) => EQUIPMENT_LABELS[e]).join(', ') || '장비 없음'
                        }`}
                        bottomProps={{ typography: 't7', color: colors.grey600 }}
                      />
                    }
                    right={
                      <Button
                        type="danger"
                        style="weak"
                        size="small"
                        onClick={e => {
                          e.stopPropagation();
                          if (window.confirm('정말 취소하시겠습니까?')) {
                            handleCancel(res.id);
                          }
                        }}
                      >
                        취소
                      </Button>
                    }
                  />
                </div>
              )
            )}
          </div>
        )}
      </div>

      <Spacing size={24} />
      <Border size={8} />
      <Spacing size={24} />

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
