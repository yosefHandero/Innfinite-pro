import { getBookingsWithAuth } from "@/lib/bookingUtils";

export const getBookingsByUserId = async () => {
  return getBookingsWithAuth();
};
