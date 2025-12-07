import prismadb from "@/lib/prismadb";

export const getBookings  = async (hotelId: string) => {
    try {
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() -1)

        const bookings = await prismadb.booking.findMany({
            where: {
                hotelId,
                endDate: {
                    gt: yesterday,

                }
            }
        })
        return bookings;
    } catch (error: unknown) {
        console.error('Error fetching bookings:', error);
        throw new Error(error instanceof Error ? error.message : 'Failed to fetch bookings');
    }
}