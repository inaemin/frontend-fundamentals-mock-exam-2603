import { css } from '@emotion/react';
import { Spacing, Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { ReactNode } from 'react';

interface PageSectionProps {
  title: ReactNode;
  children: ReactNode;
}

export function PageSection({ title, children }: PageSectionProps) {
  return (
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
        {typeof title === 'string' ? (
          <Text typography="t5" fontWeight="bold" color={colors.grey900}>
            {title}
          </Text>
        ) : (
          title
        )}
      </div>
      <Spacing size={16} />
      {children}
    </div>
  );
}
