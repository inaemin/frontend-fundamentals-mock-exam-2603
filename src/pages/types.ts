export type CreateReservationInput = {
  roomId: string;
  date: string;
  start: string;
  end: string;
  attendees: number;
  equipment: string[];
};

export const MESSAGE_TYPE = {
  SUCCESS: 'success',
  ERROR: 'error',
} as const;

export type MessageType = (typeof MESSAGE_TYPE)[keyof typeof MESSAGE_TYPE];
export type MessageState = { type: MessageType; text: string };
