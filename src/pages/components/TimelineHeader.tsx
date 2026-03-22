import { css } from '@emotion/react';
import { Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { TIME_SLOTS, TOTAL_MINUTES } from 'pages/constants';
import { timeToOffsetMinutes } from 'pages/utils';

const HOUR_LABELS = TIME_SLOTS.filter(t => t.endsWith(':00'));

function HourLabel({ time }: { time: string }) {
  const timeOffsetPercent = (timeToOffsetMinutes(time) / TOTAL_MINUTES) * 100;
  return (
    <Text
      typography="t7"
      fontWeight="regular"
      color={colors.grey400}
      css={css`
        position: absolute;
        left: ${timeOffsetPercent}%;
        transform: translateX(-50%);
        font-size: 10px;
        letter-spacing: -0.3px;
      `}
    >
      {time.slice(0, 2)}
    </Text>
  );
}

export function TimelineHeader() {
  return (
    <div
      css={css`
        display: flex;
        align-items: flex-end;
        margin-bottom: 18px;
      `}
    >
      <div
        css={css`
          width: 80px;
          flex-shrink: 0;
          padding-right: 8px;
          height: 18px;
        `}
      />
      <div
        css={css`
          flex: 1;
          position: relative;
          height: 18px;
        `}
      >
        {HOUR_LABELS.map(t => (
          <HourLabel key={t} time={t} />
        ))}
      </div>
    </div>
  );
}
