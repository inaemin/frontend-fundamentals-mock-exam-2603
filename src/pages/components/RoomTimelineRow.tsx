import { css } from '@emotion/react';
import { Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { ReservationBar } from './ReservationBar';

interface Reservation {
  id: string;
  start: string;
  end: string;
  attendees: number;
  equipment: string[];
}

interface RoomTimelineRowProps {
  room: { id: string; name: string };
  reservations: Reservation[];
  index: number;
  activeReservation: string | null;
  onActiveReservationChange: (id: string | null) => void;
}

export function RoomTimelineRow({
  room,
  reservations,
  index,
  activeReservation,
  onActiveReservationChange,
}: RoomTimelineRowProps) {
  return (
    <div
      css={css`
        display: flex;
        align-items: center;
        height: 32px;
        ${index > 0 ? 'margin-top: 4px;' : ''}
      `}
    >
      <div
        css={css`
          width: 80px;
          flex-shrink: 0;
          padding-right: 8px;
        `}
      >
        <Text
          typography="t7"
          fontWeight="medium"
          color={colors.grey700}
          ellipsisAfterLines={1}
          css={css`
            font-size: 12px;
          `}
        >
          {room.name}
        </Text>
      </div>
      <div
        css={css`
          flex: 1;
          height: 24px;
          background: ${colors.white};
          border-radius: 6px;
          position: relative;
          overflow: visible;
        `}
      >
        {reservations.map(res => (
          <ReservationBar
            key={res.id}
            reservation={res}
            roomName={room.name}
            isActive={activeReservation === res.id}
            onActiveChange={onActiveReservationChange}
          />
        ))}
      </div>
    </div>
  );
}
