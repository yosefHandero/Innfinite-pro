import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs"

export const getBookingsByUserId = async()=> {
    try {
        const{userId} = auth()
        if(!userId){throw new Error('User not authenticated')};
        const bookings = await prismadb.booking.findMany({
            where: {
                userId
            },
            include: {
                Room: true,
                Hotel: true,
            },
            orderBy:{
                bookedAt: "desc",
            }
        })
        if(!bookings) return null
        return bookings;
    } catch (error: unknown) {
        console.error('Error fetching bookings by user:', error);
        throw new Error(error instanceof Error ? error.message : 'Failed to fetch bookings');
    }
}