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
  timeElapsed: number;
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

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: 'vinyl' | 'apparel' | 'poster' | 'accessory';
  stock: number;
}

export interface CartItem {
  id: string;
  productId: string;
  title: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, ticketType?: string) => void;
  updateQuantity: (productId: string, ticketType: string, quantity: number) => void;
  clearCart: () => void;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
  customerName: string;
  customerEmail: string;
}

export interface AdminStats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  pendingOrders: number;
}