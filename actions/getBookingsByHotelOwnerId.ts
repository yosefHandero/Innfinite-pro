import { getBookingsWithAuth } from "@/lib/bookingUtils";

export const getBookingsByHotelOwnerId = async () => {
  return getBookingsWithAuth({ hotelOwnerId: true });
};
