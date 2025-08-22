import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";

interface BookingQueryOptions {
  hotelOwnerId?: boolean;
}

export const getBookingsWithAuth = async (options: BookingQueryOptions = {}) => {
  try {
    const { userId } = auth();
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const whereClause = options.hotelOwnerId 
      ? { hotelOwnerId: userId }
      : { userId };

    const bookings = await prismadb.booking.findMany({
      where: whereClause,
      include: {
        Room: true,
        Hotel: true,
      },
      orderBy: {
        bookedAt: "desc",
      }
    });

    if (!bookings) return null;
    return bookings;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
