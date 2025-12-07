import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";

export const getHotelsByUserId = async () => {
  try {
    const {userId} = auth()
    if(!userId) {
        throw new Error ('No user logged in')
    }
    const hotels = await prismadb.hotel.findMany({
      where: { userId },
      include: { rooms: true },
    });
    if (!hotels) return null;
    return hotels;
  } catch (error: unknown) {
    console.error('Error fetching hotels by user:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch hotels');
  }
};
