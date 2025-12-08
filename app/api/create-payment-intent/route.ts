import prismadb from '@/lib/prismadb';
import { currentUser } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.error('Missing STRIPE_SECRET_KEY environment variable');
}

const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
    })
  : null;

export async function POST(req: Request) {
  try {
    if (!stripe) {
      return new NextResponse('Stripe is not configured', { status: 500 });
    }

    const user = await currentUser();

    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { booking, payment_intent_id } = body;

    if (!booking || !booking.hotelId || !booking.roomId || !booking.hotelOwnerId) {
      return new NextResponse('Invalid booking data', { status: 400 });
    }

    // Validate booking data
    if (!booking.startDate || !booking.endDate || !booking.totalPrice) {
      return new NextResponse('Missing required booking fields', { status: 400 });
    }

    if (booking.totalPrice <= 0) {
      return new NextResponse('Invalid total price', { status: 400 });
    }

    // Verify the room belongs to the hotel
    const room = await prismadb.room.findUnique({
      where: { id: booking.roomId },
    });

    if (!room || room.hotelId !== booking.hotelId) {
      return new NextResponse('Room does not belong to the specified hotel', { status: 400 });
    }

    // Verify the hotel owner ID matches
    const hotel = await prismadb.hotel.findUnique({
      where: { id: booking.hotelId },
    });

    if (!hotel || hotel.userId !== booking.hotelOwnerId) {
      return new NextResponse('Invalid hotel owner', { status: 400 });
    }

    const bookingData = {
      ...booking,
      userName: user.firstName || user.username || 'User',
      userEmail: user.emailAddresses[0]?.emailAddress || '',
      userId: user.id,
      currency: 'usd',
      paymentIntentId: payment_intent_id || '',
    };

    let foundBooking;

    if (payment_intent_id) {
      foundBooking = await prismadb.booking.findUnique({
        where: { paymentIntentId: payment_intent_id, userId: user.id },
      });
    }

    if (foundBooking && payment_intent_id) {
      // Update existing booking
      try {
        const current_intent = await stripe.paymentIntents.retrieve(payment_intent_id);

        if (current_intent.status === 'succeeded') {
          return new NextResponse('Payment already completed', { status: 400 });
        }

        const updated_intent = await stripe.paymentIntents.update(payment_intent_id, {
          amount: booking.totalPrice * 100,
        });

        const res = await prismadb.booking.update({
          where: { paymentIntentId: payment_intent_id, userId: user.id },
          data: bookingData,
        });

        if (!res) {
          return new NextResponse('Failed to update booking', { status: 500 });
        }

        return NextResponse.json({ paymentIntent: updated_intent });
      } catch (stripeError: any) {
        console.error('Stripe error:', stripeError);
        return new NextResponse(
          `Stripe error: ${stripeError.message || 'Unknown error'}`,
          { status: 500 }
        );
      }
    } else {
      // Create new booking
      try {
        const paymentIntent = await stripe.paymentIntents.create({
          amount: booking.totalPrice * 100,
          currency: bookingData.currency,
          automatic_payment_methods: { enabled: true },
          metadata: {
            userId: user.id,
            hotelId: booking.hotelId,
            roomId: booking.roomId,
          },
        });

        bookingData.paymentIntentId = paymentIntent.id;

        await prismadb.booking.create({
          data: bookingData,
        });

        return NextResponse.json(paymentIntent);
      } catch (stripeError: any) {
        console.error('Stripe error:', stripeError);
        return new NextResponse(
          `Stripe error: ${stripeError.message || 'Unknown error'}`,
          { status: 500 }
        );
      }
    }
  } catch (error: any) {
    console.error('Error at /api/create-payment-intent POST', error);
    return new NextResponse(
      `Internal Server Error: ${error.message || 'Unknown error'}`,
      { status: 500 }
    );
  }
}

