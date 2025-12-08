import { getHotelsByUserId } from "@/actions/hotel/getHotelsByUserId";
import HotelList from "@/components/hotel/HotelList";
import { Hotel, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const myHotels = async () => {
  const hotels = await getHotelsByUserId();

  if (!hotels || hotels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 min-h-[60vh]">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto">
            <Hotel className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-semibold">No hotels yet</h2>
          <p className="text-muted-foreground">
            Start your hosting journey by adding your first hotel. Share your
            space with travelers from around the world.
          </p>
          <Button asChild size="lg" className="mt-4">
            <Link href="/hotel/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Hotel
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 md:py-12 space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Hotels</h1>
          <p className="text-muted-foreground mt-1">
            Manage your {hotels.length} hotel{hotels.length > 1 ? "s" : ""}
          </p>
        </div>
        <Button asChild>
          <Link href="/hotel/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Hotel
          </Link>
        </Button>
      </div>
      <HotelList hotels={hotels} />
    </div>
  );
};

export default myHotels;
