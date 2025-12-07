import { getBookingsByHotelOwnerId } from "@/actions/booking/getBookingsByHotelOwnerId";
import { getBookingsByUserId } from "@/actions/booking/getBookingsByUserId";
import MyBookingsClient from "@/components/booking/MyBookingsClient";
import { Calendar, Hotel } from "lucide-react";

const MyBookings = async () => {
  const bookingsFromVisitors = await getBookingsByHotelOwnerId();
  const bookingsIHaveMade = await getBookingsByUserId();

  const hasNoBookings =
    (!bookingsFromVisitors || bookingsFromVisitors.length === 0) &&
    (!bookingsIHaveMade || bookingsIHaveMade.length === 0);

  if (hasNoBookings) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 min-h-[60vh]">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto">
            <Calendar className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-semibold">No bookings yet</h2>
          <p className="text-muted-foreground">
            {bookingsIHaveMade?.length === 0
              ? "You haven't made any bookings yet. Start exploring hotels to book your stay!"
              : "No visitors have booked your hotels yet."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-12 py-8">
      {!!bookingsIHaveMade?.length && (
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="h-5 w-5 text-primary" />
            <h2 className="text-2xl md:text-3xl font-semibold">My Bookings</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {bookingsIHaveMade.map((booking, index) => (
              <MyBookingsClient
                key={booking.id}
                booking={booking}
                index={index}
              />
            ))}
          </div>
        </div>
      )}
      {!!bookingsFromVisitors?.length && (
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Hotel className="h-5 w-5 text-primary" />
            <h2 className="text-2xl md:text-3xl font-semibold">
              Guest Bookings
            </h2>
          </div>
          <p className="text-muted-foreground mb-6">
            Bookings that visitors have made on your hotels
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {bookingsFromVisitors.map((booking, index) => (
              <MyBookingsClient
                key={booking.id}
                booking={booking}
                index={index}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
