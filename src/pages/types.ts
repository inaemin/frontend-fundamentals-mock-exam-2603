export type Room = {
  id: string;
  name: string;
  floor: number;
  capacity: number;
  equipment: string[];
};

export type Reservation = {
  id: string;
  roomId: string;
  date: string;
  start: string;
  end: string;
  attendees: number;
  equipment: string[];
};

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
