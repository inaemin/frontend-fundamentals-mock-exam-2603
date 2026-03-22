export const MESSAGE_TYPE = {
  SUCCESS: 'success',
  ERROR: 'error',
} as const;

export type MessageType = (typeof MESSAGE_TYPE)[keyof typeof MESSAGE_TYPE];
export type MessageState = { type: MessageType; text: string };
