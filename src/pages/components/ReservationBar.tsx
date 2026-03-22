import { css } from '@emotion/react';
import { colors } from '_tosslib/constants/colors';
import { EQUIPMENT_LABELS, TOTAL_MINUTES } from 'pages/constants';
import { timeToOffsetMinutes } from 'pages/utils';

interface Reservation {
  id: string;
  start: string;
  end: string;
  attendees: number;
  equipment: string[];
}

interface ReservationBarProps {
  reservation: Reservation;
  roomName: string;
  isActive: boolean;
  onActiveChange: (id: string | null) => void;
}

export function ReservationBar({ reservation: res, roomName, isActive, onActiveChange }: ReservationBarProps) {
  const timeOffsetPercent = (timeToOffsetMinutes(res.start) / TOTAL_MINUTES) * 100;
  const width = ((timeToOffsetMinutes(res.end) - timeToOffsetMinutes(res.start)) / TOTAL_MINUTES) * 100;

  return (
    <div
      css={css`
        position: absolute;
        left: ${timeOffsetPercent}%;
        width: ${width}%;
        height: 100%;
      `}
    >
      <div
        role="button"
        aria-label={`${roomName} ${res.start}-${res.end} 예약 상세`}
        onClick={() => onActiveChange(isActive ? null : res.id)}
        css={css`
          width: 100%;
          height: 100%;
          background: ${colors.blue400};
          border-radius: 4px;
          opacity: ${isActive ? 1 : 0.75};
          cursor: pointer;
          transition: opacity 0.15s;
          &:hover {
            opacity: 1;
          }
        `}
      />
      {isActive && (
        <div
          role="tooltip"
          css={css`
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            margin-top: 6px;
            background: ${colors.grey900};
            color: ${colors.white};
            padding: 8px 12px;
            border-radius: 8px;
            font-size: 12px;
            white-space: nowrap;
            z-index: 10;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
            line-height: 1.6;
          `}
        >
          <div>
            {res.start} ~ {res.end}
          </div>
          <div>{res.attendees}명</div>
          {res.equipment.length > 0 && (
            <div>{res.equipment.map((e: string) => EQUIPMENT_LABELS[e]).join(', ')}</div>
          )}
        </div>
      )}
    </div>
  );
}
