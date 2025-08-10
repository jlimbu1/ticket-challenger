export enum TicketingSessionStatus {
  CREATED = "created",
  WAITING = "waiting",
  IN_PROGRESS = "inProgress",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export interface ITicket {
  _id: string;
  name: string;
  price: number;
  capacity: number;
}

export interface ITicketingSession {
  _id: string;
  username: string;
  tickets: ITicketUpdateData[];
  totalScore: number;
  initialQueuePosition: number;
  queuePosition: number;
  timeElapsed: number; // in seconds
  status: TicketingSessionStatus;
  createdAt: Date;
  updatedAt: Date;
  _score: number;
}

export interface IQueueUpdateData {
  status: TicketingSessionStatus;
  position: number;
  estimatedWait: number;
}

export interface ITicketUpdateData {
  _id: string;
  name: string;
  price: number;
  capacity: number;
  sold: number;
  remaining: number;
  popularity: number;
  bought: number;
}

export interface ITicketUpdateBulkData {
  updates: ITicketUpdateData[];
  timestamp: string;
}

export interface IQueueUpdateEvent {
  status: TicketingSessionStatus;
  position: number;
  estimatedWait: number;
  lastUpdated: string;
}

export interface IQueueCompleteEvent {
  message: string;
  timestamp: string;
}

export interface ITicketCartInfo {
  _id: string;
  name: string;
  price: number;
  isSoldOut: boolean;
  quantity: number;
}
