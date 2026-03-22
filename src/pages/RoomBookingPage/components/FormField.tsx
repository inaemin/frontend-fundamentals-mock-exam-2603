import { css } from '@emotion/react';
import { Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';

interface FormFieldProps {
  label: string;
  flex?: boolean;
  spacing?: number;
  children: React.ReactNode;
}

export function FormField({ label, flex, spacing = 6, children }: FormFieldProps) {
  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        gap: ${spacing}px;
        ${flex ? 'flex: 1;' : ''}
      `}
    >
      <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>
        {label}
      </Text>
      {children}
    </div>
  );
}
