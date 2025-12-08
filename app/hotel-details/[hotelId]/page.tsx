import { getBookings } from "@/actions/booking/getBookings";
import { getHotelById } from "@/actions/hotel/getHotelById";
import HotelDetailsClient from "@/components/hotel/HotelDetailsClient";
import { notFound } from "next/navigation";

interface HotelDetailsProps {
  params: {
    hotelId: string;
  };
}

const HotelDetails = async ({ params }: HotelDetailsProps) => {
  try {
    const hotel = await getHotelById(params.hotelId);

    if (!hotel) {
      notFound();
    }

    const bookings = await getBookings(hotel.id);

    return (
      <div className="py-8">
        <HotelDetailsClient hotel={hotel} bookings={bookings || []} />
      </div>
    );
  } catch (error) {
    console.error("Error loading hotel details:", error);
    notFound();
  }
};

export default HotelDetails;
