import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Enhanced validation
    if (!body.title || typeof body.title !== 'string' || body.title.trim().length < 3) {
      return new NextResponse('Title must be at least 3 characters long', { status: 400 });
    }

    if (!body.description || typeof body.description !== 'string' || body.description.trim().length < 10) {
      return new NextResponse('Description must be at least 10 characters long', { status: 400 });
    }

    if (!body.image || typeof body.image !== 'string' || body.image.trim().length === 0) {
      return new NextResponse('Image URL is required', { status: 400 });
    }

    if (!body.country || typeof body.country !== 'string' || body.country.trim().length === 0) {
      return new NextResponse('Country is required', { status: 400 });
    }

    if (!body.locationDescription || typeof body.locationDescription !== 'string' || body.locationDescription.trim().length < 10) {
      return new NextResponse('Location description must be at least 10 characters long', { status: 400 });
    }

    const hotel = await prismadb.hotel.create({
      data: {
        ...body,
        userId,
      },
    });

    return NextResponse.json(hotel);
  } catch (error: any) {
    console.error('Error at /api/hotel POST', error);
    return new NextResponse(
      `Internal Server Error: ${error.message || 'Unknown error'}`,
      { status: 500 }
    );
  }
}