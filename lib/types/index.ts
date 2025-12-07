import { Hotel, Room } from "@prisma/client";

export type HotelWithRooms = Hotel & {
  rooms: Room[];
};

export type BookingWithRelations = {
  id: string;
  userName: string;
  userEmail: string;
  userId: string;
  roomId: string;
  hotelId: string;
  hotelOwnerId: string;
  startDate: Date;
  endDate: Date;
  breakFastIncluded: boolean;
  currency: string;
  totalPrice: number;
  paymentStatus: boolean;
  paymentIntentId: string;
  bookedAt: Date;
  Room: Room | null;
  Hotel: Hotel | null;
};
