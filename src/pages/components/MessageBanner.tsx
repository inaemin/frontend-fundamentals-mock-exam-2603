import { css } from '@emotion/react';
import { Spacing, Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { MessageState, MESSAGE_TYPE } from 'pages/types';

interface MessageBannerProps {
  message: MessageState;
}

export function MessageBanner({ message }: MessageBannerProps) {
  const isSuccess = message.type === MESSAGE_TYPE.SUCCESS;
  return (
    <div
      css={css`
        padding: 0 24px;
      `}
    >
      <div
        css={css`
          padding: 10px 14px;
          border-radius: 10px;
          background: ${isSuccess ? colors.blue50 : colors.red50};
          display: flex;
          align-items: center;
          gap: 8px;
        `}
      >
        <Text typography="t7" fontWeight="medium" color={isSuccess ? colors.blue600 : colors.red500}>
          {message.text}
        </Text>
      </div>
      <Spacing size={12} />
    </div>
  );
}
