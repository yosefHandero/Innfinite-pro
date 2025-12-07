import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function POST(req:Request) {
    try {
        const body = await req.json();
        const {userId} = auth()
        if (!userId){
            return new NextResponse('Unauthorized', { status: 401 })
        }

        if (!body.hotelId) {
            return new NextResponse('Hotel ID is required', { status: 400 });
        }

        // Verify the hotel exists and user owns it
        const hotel = await prismadb.hotel.findUnique({
            where: { id: body.hotelId },
        });

        if (!hotel) {
            return new NextResponse('Hotel not found', { status: 404 });
        }

        if (hotel.userId !== userId) {
            return new NextResponse('Forbidden: You don\'t own this hotel', { status: 403 });
        }

        const room = await prismadb.room.create({
            data:{
                ...body,
            }
        })
        return  NextResponse.json(room)
    } catch (error) {
        console.error('Error at /api/room POST', error); 
    return new NextResponse('Internal Server Error', { status: 500 });
    }
}